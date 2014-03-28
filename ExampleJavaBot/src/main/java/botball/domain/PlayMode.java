package botball.domain;

public enum PlayMode {
	DEFENCE(0), ATTACK(1);
	private int mode = 0;
	private PlayMode(int mode) {
		this.mode = mode;
	}
	
	public int getMode() {
		return mode;
	}

}
