package botball.domain;

public class PitchVector implements Comparable<PitchVector>{
	
	private Direction direction;
	private Integer magnitude;
	
	public PitchVector(Direction direction, Integer magnitude){
		this.direction = direction;
		this.magnitude = magnitude;
		
	}
	
	public Integer getMagnitude() {
		return magnitude;
	}
	public void setMagnitude(Integer magnitude) {
		this.magnitude = magnitude;
	}
	public Direction getDirection() {
		return direction;
	}
	public void setDirection(Direction direction) {
		this.direction = direction;
	}

	public int compareTo(PitchVector o) {
		int order = this.getDirection().compareTo(o.getDirection());
		if(order == 0){
			order = this.getMagnitude().compareTo(o.getMagnitude());
		}
		return order;
	}
	
	@Override
	public String toString(){
		return "Vector[Magnitude: " + getMagnitude() + ", Direction: " + getDirection() + "]";
	}
	
	

}
