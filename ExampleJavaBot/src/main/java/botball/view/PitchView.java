package botball.view;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import botball.domain.PitchVector;
import botball.domain.Position;
import botball.utils.GeometryHelper;

public class PitchView {
	
	public static boolean weHavePossesion(Position ball, List<Position> teamPositions, List<Position> opponentPositions){
		//Get the vector to the ball for every player on the pitch and add to a list to sort to find the best
		List<PitchVector> teamPosBallVectors = new ArrayList<PitchVector>();
		List<PitchVector> opponentPosBallVectors = new ArrayList<PitchVector>();
		
		for(Position pos : teamPositions){
			PitchVector vectorToBall = new PitchVector(GeometryHelper.directionToTarget(pos, ball), GeometryHelper.distanceToTarget(pos, ball));
			teamPosBallVectors.add(vectorToBall);			
		}
		for(Position pos : opponentPositions){
			PitchVector vectorToBall = new PitchVector(GeometryHelper.directionToTarget(pos, ball), GeometryHelper.distanceToTarget(pos, ball));
			opponentPosBallVectors.add(vectorToBall);			
		}
		Collections.sort(teamPosBallVectors);
		Collections.sort(opponentPosBallVectors);
		PitchVector bestTeamVector = teamPosBallVectors.get(0);
		PitchVector bestOpponentVector = opponentPosBallVectors.get(0);
		if(bestTeamVector.compareTo(bestOpponentVector) > 0){
			return true;
		}
		return false;
		
	}

}
