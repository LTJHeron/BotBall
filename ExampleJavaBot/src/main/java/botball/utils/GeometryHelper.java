package botball.utils;

import botball.domain.Direction;
import botball.domain.Position;

public class GeometryHelper {
	
	public static Direction directionToTarget(Position playerPosition, Position target) {
		Double playerX = Double.parseDouble(playerPosition.getX());
		Double ballX = Double.parseDouble(target.getX());
		Double playerY = Double.parseDouble(playerPosition.getY());
		Double ballY = Double.parseDouble(target.getY());	
		//First check if we are in the same plane as the ball
		if(playerX.compareTo(ballX) == 0){
			//we are both on the same point on the x-axis so move either north or south
			if(playerY.compareTo(ballY) < 0){
				//we are south of the ball so move north
				return Direction.N;
			} else {
				return Direction.S;
			}
		}
		if(playerY.compareTo(ballY) == 0){
			//we are both on the same point on the y-axis so move either east or west
			if(playerX.compareTo(ballX) < 0){
				//we are west of the ball move east
				return Direction.E;
			} else {
				return Direction.W;
			}
		}
		Double opposite = ballY - playerY;
		Double adjacent = ballX - playerX;
		Double angleInDegrees = 0d;
		if (adjacent != 0){			
			Double tanTheta = opposite/adjacent;
			Double angleBetweenBallAndPlayer = Math.atan(tanTheta);
			angleInDegrees = Math.toDegrees(angleBetweenBallAndPlayer);
			if(adjacent < 0){
				angleInDegrees = 180 + angleInDegrees;
			}else if(opposite < 0){
				angleInDegrees = 360 + angleInDegrees;
			}
		}
		
		if(angleInDegrees <= 360){
			if(angleInDegrees > 337.5){
				return Direction.E;
			}
			if(angleInDegrees > 292.5){
				return Direction.SE;
			}
			if(angleInDegrees > 247.5){
				return Direction.S;
			}
			if(angleInDegrees > 202.5){
				return Direction.SW;
			}
			if(angleInDegrees > 157.5){
				return Direction.W;
			}
			if(angleInDegrees > 112.5){
				return Direction.NW;
			}
			if(angleInDegrees > 67.5){
				return Direction.N;
			}
			if(angleInDegrees > 22.5){
				return Direction.NE;
			}
			if(angleInDegrees > 0){
				return Direction.E;
			}
		}
		//If none of these apply just set to east
		return Direction.E;
	}
	
	public static Integer distanceToTarget(Position playerPosition, Position target){
		Double playerX = Double.parseDouble(playerPosition.getX());
		Double targetX = Double.parseDouble(target.getX());
		Double playerY = Double.parseDouble(playerPosition.getY());
		Double targetY = Double.parseDouble(target.getY());
		Double magnitude = Math.sqrt(Math.pow((targetX - playerX), 2) + Math.pow((targetY - playerY), 2));
		return magnitude.intValue();		
	}	

}
