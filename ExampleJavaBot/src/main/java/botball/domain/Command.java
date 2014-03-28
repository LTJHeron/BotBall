package botball.domain;

/**
 * @author Kriton
 */
public class Command {
	private final Action action;
	private final Direction direction;

	public Command(Action action, Direction direction) {
		this.action = action;
		this.direction = direction;
	}

	public Action getAction() {
		return action;
	}

	public Direction getDirection() {
		return direction;
	}

	@Override
	public String toString() {
		return "{\"" + action + "\" : \"" + direction + "\"}";
	}
}
