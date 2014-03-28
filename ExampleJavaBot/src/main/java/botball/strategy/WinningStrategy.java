package botball.strategy;

import java.util.ArrayList;
import java.util.List;

import botball.domain.Action;
import botball.domain.Command;
import botball.domain.CommandSet;
import botball.domain.Direction;
import botball.domain.PlayMode;
import botball.domain.Position;
import botball.domain.SnapShot;
import botball.utils.GeometryHelper;
import botball.view.PitchView;
import botball.view.PlayerView;

public class WinningStrategy implements Strategy {

	public CommandSet execute(SnapShot snapshot) {
		int myBot = snapshot.getYourBot();
		Position ball = snapshot.getBall();
		List<Position> myPositions;
		List<Position> oppositionPositions;
		List<Command> commandsToSend = new ArrayList<Command>(5);
		boolean isShootingEast = true;
		Direction shootingDirection = Direction.E;
		if(myBot == 0) {
			myPositions = snapshot.getPlayer0();
			oppositionPositions = snapshot.getPlayer1();
		} else {
			myPositions = snapshot.getPlayer1();
			oppositionPositions = snapshot.getPlayer0();
			isShootingEast = false;
			shootingDirection = Direction.W;
		}
		int playerCounter = 0;
		/*
		 * First we need to check if our team has possession
		 * If we have possession then we are in attack mode
		 *
		 */
		PlayMode mode = PlayMode.DEFENCE;
		if(PitchView.weHavePossesion(ball, myPositions, oppositionPositions)){
			mode = PlayMode.ATTACK;
		}
		
		
		/*
		 * Loop through all our players and decide what that player should do.
		 * We are going to set up the team so there is a ball carrier, the middle player, two wingers the far left and right players
		 * and two defenders the inner left and right players. 
		 * If the player has the ball they should try to do the same thing whichever position.
		 */		
		for(Position playerPosition : myPositions){
			//Create a player view for each player, this allows us to see what each player can do
			PlayerView playerView = new PlayerView(mode, ball, playerPosition, playerCounter, myPositions, oppositionPositions, isShootingEast, shootingDirection);
			//Create default command, just stand still
			Command cmd = new Command(Action.move, Direction.NODIRECTION);
			if(playerView.playerHasTheBall()){
				if(playerView.shouldShoot()){
					cmd = new Command(Action.kick, shootingDirection);
				} else if(playerView.directionToPass() != null){
					cmd = new Command(Action.kick, playerView.directionToPass());
				} else {
					cmd = new Command(Action.move, playerView.directionToMove());
				}
											
			} else {
				//Our player doesn't have the ball, decide what to do based on position
				
				//Since we don't have the ball we are going to always move just need to know direction
				//Set command for when we don't have the ball
				cmd = new Command(Action.move, playerView.directionToMove());
			}
			commandsToSend.add(playerCounter, cmd);
			playerCounter++;
		}
		CommandSet cmdSet = new CommandSet(commandsToSend.get(0), commandsToSend.get(1), commandsToSend.get(2), commandsToSend.get(3), commandsToSend.get(4));
		return cmdSet;		
	}
}
