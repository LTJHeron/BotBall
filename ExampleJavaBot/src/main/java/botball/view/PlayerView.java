package botball.view;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import botball.BotBallIO;
import botball.domain.Direction;
import botball.domain.PitchVector;
import botball.domain.PlayMode;
import botball.domain.Position;
import botball.utils.GeometryHelper;

public class PlayerView {
	Position ball;
	Position player;
	Integer playerPosition;
	List<Position> teamPositions;
	List<Position> opponentPositions;
	PitchVector vectorToBall;
	boolean isShootingEast;
	Integer goalLine = 0;
	Integer ourLine = 30;
	private static final Integer halfwayLine = 15;
	Direction shootingDirection = Direction.W;
	Direction defendDirection = Direction.E;
	List<Direction>shotingDirections = Arrays.asList(Direction.W, Direction.SW, Direction.NW);
	PlayMode mode;
	
	public PlayerView(){
		
	}
	
	public PlayerView(PlayMode mode, Position ball, Position player, Integer playerPosition, 
						List<Position> teamPositions, List<Position> opponentPositions, 
						boolean isShootingEast, Direction shootingDirection){
		this.mode = mode;
		this.ball = ball;
		this.player = player;
		this.playerPosition = playerPosition;
		this.teamPositions = teamPositions;
		this.opponentPositions = opponentPositions;
		this.isShootingEast = isShootingEast;
		this.shootingDirection = shootingDirection;
		//depending which way we are shooting x = 0 is the goal line or x = 30
		if(isShootingEast){
			this.goalLine = 30;
			this.ourLine = 0;
			shotingDirections = Arrays.asList(Direction.E, Direction.SE, Direction.NE);
			defendDirection = Direction.W;
		}
		vectorToBall = new PitchVector(GeometryHelper.directionToTarget(player, ball), GeometryHelper.distanceToTarget(player, ball));
	}
	
	public Position getBall() {
		return ball;
	}

	public void setBall(Position ball) {
		this.ball = ball;
	}

	public Position getPlayer() {
		return player;
	}

	public void setPlayer(Position player) {
		this.player = player;
	}

	public List<Position> getTeamPositions() {
		return teamPositions;
	}

	public void setTeamPositions(List<Position> teamPositions) {
		this.teamPositions = teamPositions;
	}

	public List<Position> getOpponentPositions() {
		return opponentPositions;
	}

	public void setOpponentPositions(List<Position> opponentPositions) {
		this.opponentPositions = opponentPositions;
	}
	
	public Integer getPlayerPosition() {
		return playerPosition;
	}

	public void setPlayerPosition(Integer playerPosition) {
		this.playerPosition = playerPosition;
	}

	public boolean isShootingEast() {
		return isShootingEast;
	}

	public void setShootingEast(boolean isShootingEast) {
		this.isShootingEast = isShootingEast;
	}

	public Integer getGoalLine() {
		return goalLine;
	}

	public void setGoalLine(Integer goalLine) {
		this.goalLine = goalLine;
	}

	public Direction getShootingDirection() {
		return shootingDirection;
	}

	public void setShootingDirection(Direction shootingDirection) {
		this.shootingDirection = shootingDirection;
	}

	public Direction directionToMove(){
		if(Integer.parseInt(player.getX()) == goalLine) return defendDirection; 
		//Look at all the positions of the players on the field and move in to space preferably forward if not directly then as close to forward as poss
		List<PitchVector> vectorsOfTeam = vectorsOfPlayers(true);
		List<PitchVector> vectorsToOpposingPlayers = vectorsOfPlayers(false);
		Set<Direction> notPossibleDirections = new HashSet<Direction>();
		for(PitchVector oppositionVector : vectorsToOpposingPlayers){
			if(oppositionVector.getMagnitude().compareTo(1) <= 0 ){
				//We can't move in this direction opponent blocking, add direction to not possible directions
				notPossibleDirections.add(oppositionVector.getDirection());
			}			
		}
		int playerCount = 0;
		int playerToMoveTo = 0;
		for(PitchVector teamVector : vectorsOfTeam){
			if(playerCount == playerPosition) break;
			if(teamVector.getMagnitude().compareTo(1) <= 0 ){
				//We can't move in this direction team mate blocking, add direction to not possible directions
				notPossibleDirections.add(teamVector.getDirection());
			}
			//Try and keep all players 5 blocks from each other
			if(teamVector.getMagnitude() < 5){
				notPossibleDirections.add(teamVector.getDirection());
			}
			if(vectorToBall.getMagnitude().compareTo(teamVector.getMagnitude()) > 0){
				//Go towards this player
				playerToMoveTo = playerCount;
				
			}
			playerCount++;
		}
		Direction idealDirection = Direction.NODIRECTION;
		//If the player is closest to the ball move towards it no matter what!
		if(isClosestToBall() || playerPosition == 2 || vectorToBall.getMagnitude() <= 2){
			idealDirection = vectorToBall.getDirection();
		} else if(this.mode.equals(PlayMode.ATTACK)){			
			
				if(!isNearWall()){
					idealDirection = GeometryHelper.directionToTarget(player, teamPositions.get(playerToMoveTo));
				} else {
					//move to the centre
					idealDirection = GeometryHelper.directionToTarget(player, new Position("15,15"));
				}
				//but if a defender don't cross the halfway line and move away from opponent
				if(playerPosition == 0 || playerPosition == 1){
					Position newPosition = calculateNewPostitionBasedOnIdealDirection(player, idealDirection);
					if(Integer.parseInt(newPosition.getX()) > halfwayLine){
						//Ideal direction is going to result in us moving over the halfway line stand still
						idealDirection = Direction.NODIRECTION;
					}
					if(playerPosition == 0){
						//Keep to the bottom half of the pitch
						if(Integer.parseInt(newPosition.getY()) > 10){
							//Ideal direction is going to result in us moving over to the top half of the pitch, stand still
							idealDirection = Direction.NODIRECTION;
						}
					} else {
						//Keep to the top half of the pitch
						if(Integer.parseInt(newPosition.getY()) < 10){
							//Ideal direction is going to result in us moving over to the top half of the pitch, stand still
							idealDirection = Direction.NODIRECTION;
						}
					}
				}
			} else{
				//Mode is defence, move toward opponents!
				idealDirection = closestOpponent().getDirection();
			
			}
		
		
		/*//No we have checked against the other players see if we can move based on our player position
		if(playerPosition == 0 || playerPosition == 4){
			//We are wingers so we should be looking to move forward but stay in the top half of the gird and not sit on the goal line
			if(withinShootingDistance()){
				//We are within 5 steps of the goal line so move towards ball
				 idealDirection = GeometryHelper.directionToTarget(player, ball);
			}
		}
		if(playerPosition == 1 || playerPosition == 3){
			//We are defenders so we should be looking to move forward but stay in the bottom half of the gird and not sit on the halfway line
			if(aboutToCrossHalfway()){
				//We are within 3 steps of the halfway line so stay where we are 
				idealDirection = GeometryHelper.directionToTarget(player, ball);
				if(!shotingDirections.contains(idealDirection)){
					return idealDirection;
				}
			}
		}*/
		//Determine the best direction to move in
		Set<Direction> possibleDirections = new HashSet<Direction>();
		possibleDirections.add(Direction.E);
		possibleDirections.add(Direction.W);
		possibleDirections.add(Direction.N);
		possibleDirections.add(Direction.S);
		possibleDirections.add(Direction.SE);
		possibleDirections.add(Direction.NE);
		possibleDirections.add(Direction.SW);
		possibleDirections.add(Direction.NW);
		possibleDirections.add(Direction.NODIRECTION);
		possibleDirections.removeAll(notPossibleDirections);
		if(possibleDirections.contains(idealDirection)){
			return idealDirection;
		} else{
			return findBestDirection(possibleDirections);
		}
		
		
	}
	
	private boolean isNearWall() {
		//Define the walls farWall = 20 closeWall = 0;
		//Goallines are the other walls, check if x an y values are within 2 spaces of a wall
		if(Integer.parseInt(player.getY()) > 18 || Integer.parseInt(player.getY()) < 2){
			return true;
		}
		if(Integer.parseInt(player.getX()) > 28 || Integer.parseInt(player.getX()) < 2){
			return true;
		}
		return false;
	}

	public boolean playerHasTheBall() {
		if(GeometryHelper.distanceToTarget(player, ball) <= 1) return true;
		return false;
		
	}
	
	public boolean shouldShoot() {
		if(withinShootingDistance()) return true;
		return false;
	}
	
	public Direction directionToPass() {
		//for each player position see if the vector to the ball is blocked or intercepted by the vector to the player
		List<PitchVector> vectorsOfTeam = vectorsOfPlayers(true);
		BotBallIO.debug("Vectors to team are: " + vectorsOfTeam.toString());
		List<PitchVector> vectorsToOpposingPlayers = vectorsOfPlayers(false);
		BotBallIO.debug("Vectors to opposition are: " + vectorsToOpposingPlayers.toString());
		List<PitchVector> possibleVectors = new ArrayList<PitchVector>();
		int playerCount = 0;
		for(PitchVector teamVector : vectorsOfTeam){
			BotBallIO.debug("Player count is: " + playerCount + ", playerPosition is " + playerPosition);
			if(playerCount != playerPosition){
				BotBallIO.debug("Team vector is: " + teamVector.toString());
				if(teamVector.getMagnitude() <= 5){
					//we are within reach of this player so see if there is an opponent in the way
					//Add a check to see if we can add this vector can only add if we are successful against all opponents
					int canAdd = 0;
					for(PitchVector oppositionVector : vectorsToOpposingPlayers){
						BotBallIO.debug("Opposition Vectors is: " + oppositionVector.toString());
						
						if(oppositionVector.getDirection().equals(teamVector.getDirection())){
							//Opponent in same direction see how far away compared to ball
							if(oppositionVector.getMagnitude() > teamVector.getMagnitude()){
								//our player is before the opponent can pass in that direction
								BotBallIO.debug("Can add: " + canAdd);
								canAdd++;
								
							}
						} else {
							//no opponent in the way so pass!
							BotBallIO.debug("Can add: " + canAdd);
							canAdd++;
						}
						//If we are not blocked by any players we can add to the list of possible passes
						if(canAdd == 5){
							BotBallIO.debug("Vector to be added is: " + teamVector.toString());
							possibleVectors.add(teamVector);
						}
					}
				}
			}
			playerCount++;
		}
		if(possibleVectors != null && !possibleVectors.isEmpty()) return findBestVector(possibleVectors);
		return shootingDirection;
	}

	private List<PitchVector> vectorsOfPlayers(boolean myTeam){
		List<Position> positions;
		if(myTeam){
			positions = teamPositions;
		} else {
			positions = opponentPositions;
		}
		List<PitchVector> vectorsToReturn = new ArrayList<PitchVector>(5);
		for(Position teamMember : positions){
			PitchVector vector = new PitchVector(GeometryHelper.directionToTarget(player, teamMember), GeometryHelper.distanceToTarget(player, teamMember));
			vectorsToReturn.add(vector);
		}
		return vectorsToReturn;
	}
	
	private Direction findBestDirection(Set<Direction> directions){
		if(directions == null || directions.isEmpty()) throw new IllegalArgumentException("Null or empty list of directions passed");
		//Need to turn the set to a list 
		List<Direction> setAsList = new ArrayList<Direction>(directions);
		//If we only have one item in the list return that direction
		if(setAsList.size() == 1) return setAsList.get(0);
		//More than one item we need to sort to find best direction
		Collections.sort(setAsList);
		//If we are shooting east then return the top of the list as the list is sorted on east being the best direction
		if(isShootingEast) return setAsList.get(0);
		//Else we must be shooting west so return the bottom element of the list  
		return setAsList.get(setAsList.size() - 1);		
	}
	
	private Direction findBestVector(List<PitchVector> vectors){
		if(vectors == null || vectors.isEmpty()) throw new IllegalArgumentException("Null or empty list of vectors passed");
		//If we only have one item in the list return that vectors direction
		if(vectors.size() == 1) return vectors.get(0).getDirection();
		//More than one item we need to sort to find best vector
		Collections.sort(vectors);
		BotBallIO.debug("Sorted vectors are: " + vectors.toString());
		BotBallIO.debug("Sorted vectors size is: " + vectors.size());
		//If we are shooting east then return the top of the list as the list is sorted on east being the best direction
		if(isShootingEast) return vectors.get(0).getDirection();
		//Else we must be shooting west so return the bottom element of the list  
		return vectors.get(vectors.size() - 1).getDirection();			
	}
	
	private boolean withinShootingDistance(){
		if(Math.pow((Double.valueOf(goalLine) - Double.parseDouble(player.getX())), 2) < 25) return true;
		return false;
	}
	
	private boolean aboutToCrossHalfway(){
		if(Math.pow((Double.valueOf(halfwayLine) - Double.parseDouble(player.getX())), 2) < 9)return true;
		return false;
	}
	
	private boolean isClosestToBall(){
		for(Position pos : teamPositions){
			if(GeometryHelper.distanceToTarget(pos, ball) < vectorToBall.getMagnitude()) return true;
		}
		return false;
	}
	
	private PitchVector closestOpponent(){
		List<PitchVector> pitchVectors = new ArrayList<PitchVector>();
		for(Position pos: opponentPositions){
			PitchVector vector = new PitchVector(GeometryHelper.directionToTarget(player, pos), GeometryHelper.distanceToTarget(player, pos));
			pitchVectors.add(vector);
		}
		Collections.sort(pitchVectors);
		return pitchVectors.get(0);
		
	}
	
	private Position calculateNewPostitionBasedOnIdealDirection(Position currentPos, Direction idealDirection){
		Integer x = Integer.parseInt(currentPos.getX());
		Integer y = Integer.parseInt(currentPos.getY());
		switch (idealDirection) {
		case E: x++;
			
			break;
		case W: x--;
		
			break;
		
		case N: y++;
		
			break;
		
		case S: y--;
		
			break;
			
		case NE: x++;
				 y++;
		
			break;
		case SE: x++;
				 y--;
		
			break;
			
		case SW: x--;
			 	 y--;
	
			break;
		case NW: x--;
			 	 y++;
		
			break;

		default: x++;
			break;
		}
		return new Position(x.toString() + "," + y.toString());
	}
		
}
