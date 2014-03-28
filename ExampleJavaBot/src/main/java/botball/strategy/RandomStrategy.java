package botball.strategy;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import botball.domain.Action;
import botball.domain.Command;
import botball.domain.CommandSet;
import botball.domain.Direction;
import botball.domain.SnapShot;

/**
 * @author Kriton
 */
public class RandomStrategy implements Strategy {

	private static final List<Direction> VALUES = Collections.unmodifiableList(Arrays.asList(Direction.values()));
	private static final int SIZE = VALUES.size();
	private static final long SEED = 123456L;
	private static final Random RANDOM = new Random(SEED);

	public static Direction randomDirection() {
		return VALUES.get(RANDOM.nextInt(SIZE));
	}

	public CommandSet execute(SnapShot snapshot) {
		return new CommandSet(new Command(Action.move, randomDirection()), new Command(Action.move, randomDirection()), new Command(
				Action.move, randomDirection()), new Command(Action.move, randomDirection()), new Command(Action.move, randomDirection()));
	}
}
