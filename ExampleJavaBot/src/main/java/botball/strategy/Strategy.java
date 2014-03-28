package botball.strategy;

import botball.domain.CommandSet;
import botball.domain.SnapShot;

/**
 * @author Kriton
 */
public interface Strategy {
	CommandSet execute (SnapShot snapshot);
}
