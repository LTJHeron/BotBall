package botball.utils;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import botball.domain.Direction;
import botball.domain.Position;

public class GeometryHelperTest {
	
	@Test
	public void testDirectionToBallEast() {
		Position player = new Position("2,4");
		Position ball = new Position("4,4");
		System.out.println("Angle should be 0");
		assertEquals(Direction.E, GeometryHelper.directionToTarget(player, ball));
	}
	
	@Test
	public void testDirectionToBallNorthEast() {
		Position player = new Position("0,0");
		Position ball = new Position("4,4");
		System.out.println("Angle should be 45");
		assertEquals(Direction.NE, GeometryHelper.directionToTarget(player, ball));
	}
	
	@Test
	public void testDirectionToBallNorth() {
		Position player = new Position("4,2");
		Position ball = new Position("4,4");
		System.out.println("Angle should be 90");
		assertEquals(Direction.N, GeometryHelper.directionToTarget(player, ball));
	}
	
	@Test
	public void testDirectionToBallNorthWest() {
		Position player = new Position("4,4");
		Position ball = new Position("0,8");
		System.out.println("Angle should be 135");
		assertEquals(Direction.NW, GeometryHelper.directionToTarget(player, ball));
	}
	
	@Test
	public void testDirectionToBallWest() {
		Position player = new Position("4,4");
		Position ball = new Position("0,4");
		System.out.println("Angle should be 180");
		assertEquals(Direction.W, GeometryHelper.directionToTarget(player, ball));
	}
	
	@Test
	public void testDirectionToBallSouthWest() {
		Position player = new Position("4,4");
		Position ball = new Position("0,0");
		System.out.println("Angle should be 225");
		assertEquals(Direction.SW, GeometryHelper.directionToTarget(player, ball));
	}
	
	@Test
	public void testDirectionToBallSouth() {
		Position player = new Position("4,8");
		Position ball = new Position("4,4");
		System.out.println("Angle should be 270");
		assertEquals(Direction.S, GeometryHelper.directionToTarget(player, ball));
	}
	
	@Test
	public void testDirectionToBallSouthEast() {
		Position player = new Position("0,4");
		Position ball = new Position("4,0");
		System.out.println("Angle should be 315");
		assertEquals(Direction.SE, GeometryHelper.directionToTarget(player, ball));
	}
	
	@Test
	public void testDistanceToTarget() {
		Position player = new Position("0,4");
		Position ball = new Position("4,0");
		System.out.println("Distance should be 5");
		assertEquals(Integer.valueOf(5), GeometryHelper.distanceToTarget(player, ball));
	}
	
	@Test
	public void testDistanceToTargetZeroDistance() {
		Position player = new Position("0,0");
		Position ball = new Position("0,0");
		System.out.println("Distance should be 5");
		assertEquals(Integer.valueOf(0), GeometryHelper.distanceToTarget(player, ball));
	}
}
