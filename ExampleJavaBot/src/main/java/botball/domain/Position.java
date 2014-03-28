package botball.domain;

/**
 * @author Kriton
 */
public class Position {
	
	private final String x ;
	private final String y ;
	
	public Position(String pair) {
		this.x = pair.split(",")[0];
		this.y = pair.split(",")[1];
	}
	
	public String getX() {
		return x;
	}
	public String getY() {
		return y;
	}

	@Override
	public String toString() {
		return "(" + x + ", " + y + ")";
	}
}
