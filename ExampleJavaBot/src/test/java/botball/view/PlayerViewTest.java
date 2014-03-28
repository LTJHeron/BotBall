package botball.view;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import botball.domain.Direction;
import botball.domain.Position;

public class PlayerViewTest {
	
	private PlayerView playerView;
	
	@Before
	public void setUp() throws Exception {
		playerView = new PlayerView();
		
	}

	@Test
	public void testDirectionToMove() {
		//fail("Not yet implemented");
	}

	@Test
	public void testPlayerHasTheBall() {
		//fail("Not yet implemented");
	}

	@Test
	public void testShouldShoot() {
		//fail("Not yet implemented");
	}

	@Test
	public void testDirectionToPassNoPlayersInTheWay() {
		System.out.println("Directions are: " + Direction.NODIRECTION);
		Position player = new Position("15,10");
		Position ball = new Position("4,4");
		List<Position> myTeam = Arrays.asList(new Position("15, 0"), new Position("14, 9"), new Position("15,10"), new Position("18,15"), new Position("15,20"));
		List<Position> opponentsTeam = Arrays.asList(new Position("10, 0"), new Position("2, 5"), new Position("5,10"), new Position("10,15"), new Position("10,20"));
		playerView.setTeamPositions(myTeam);
		playerView.setOpponentPositions(opponentsTeam);
		playerView.setPlayer(player);
		playerView.setPlayerPosition(2);
		playerView.setBall(ball);
		playerView.setGoalLine(0);
		playerView.setShootingDirection(Direction.W);
		playerView.setShootingEast(false);
		assertEquals(Direction.SW, playerView.directionToPass());
	}
	
	@Test
	public void testDirectionToPassPlayerInTheWay() {
		Position player = new Position("15,10");
		Position ball = new Position("4,4");
		List<Position> myTeam = Arrays.asList(new Position("15, 0"), new Position("12, 8"), new Position("15,10"), new Position("13,12"), new Position("15,20"));
		List<Position> opponentsTeam = Arrays.asList(new Position("10, 0"), new Position("13, 8"), new Position("5,10"), new Position("10,15"), new Position("10,20"));
		playerView.setTeamPositions(myTeam);
		playerView.setOpponentPositions(opponentsTeam);
		playerView.setPlayer(player);
		playerView.setPlayerPosition(2);
		playerView.setBall(ball);
		playerView.setGoalLine(0);
		playerView.setShootingDirection(Direction.W);
		playerView.setShootingEast(false);
		assertEquals(Direction.NW, playerView.directionToPass());
	}
	
	
	@Test
	public void testPlayerHasTheBallHasBallNorth(){
		Position player = new Position("4,5");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertTrue(playerView.playerHasTheBall());
	}
	
	@Test
	public void testPlayerHasTheBallHasBallNorthEast(){
		Position player = new Position("5,5");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertTrue(playerView.playerHasTheBall());
	}
	
	@Test
	public void testPlayerHasTheBallHasBallEast(){
		Position player = new Position("5,4");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertTrue(playerView.playerHasTheBall());
	}
	
	@Test
	public void testPlayerHasTheBallHasBallSouthEast(){
		Position player = new Position("5,3");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertTrue(playerView.playerHasTheBall());
	}
	
	@Test
	public void testPlayerHasTheBallHasBallSouth(){
		Position player = new Position("4,3");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertTrue(playerView.playerHasTheBall());
	}
	
	@Test
	public void testPlayerHasTheBallHasBallSouthWest(){
		Position player = new Position("3,3");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertTrue(playerView.playerHasTheBall());
	}
	
	@Test
	public void testPlayerHasTheBallHasBallWest(){
		Position player = new Position("3,4");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertTrue(playerView.playerHasTheBall());
	}
	
	@Test
	public void testPlayerHasTheBallHasBallNorthWest(){
		Position player = new Position("3,5");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertTrue(playerView.playerHasTheBall());
	}
	
	@Test
	public void testPlayerHasTheBallHasBallBangOn(){
		Position player = new Position("4,4");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertTrue(playerView.playerHasTheBall());
	}
	
	@Test
	public void testPlayerHasTheBallDoesntHaveBall(){
		Position player = new Position("3,6");
		Position ball = new Position("4,4");
		playerView.setBall(ball);
		playerView.setPlayer(player);
		assertFalse(playerView.playerHasTheBall());
	}

}
