package botball.domain;

import java.util.List;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

/**
 * @author Kriton
 */
public class SnapShot {

	private final int yourBot;
	private final List<Position> player0;
	private final List<Position> player1;
	private final Position ball;
	private final String score;

	@JsonCreator
	public SnapShot(@JsonProperty("yourbot") int yourBot, @JsonProperty("player0") List<Position> player0,
			@JsonProperty("player1") List<Position> player1, @JsonProperty("ball") Position ball, @JsonProperty("score") String score) {
		this.yourBot = yourBot;
		this.player0 = player0;
		this.player1 = player1;
		this.ball = ball;
		this.score = score;
	}

	public int getYourBot() {
		return yourBot;
	}

	public List<Position> getPlayer0() {
		return player0;
	}

	public List<Position> getPlayer1() {
		return player1;
	}

	public Position getBall() {
		return ball;
	}

	public String getScore() {
		return score;
	}

	@Override
	public String toString() {
		return "SnapShot [yourBot=" + yourBot + ", player0=" + player0 + ", player1=" + player1 + ", ball=" + ball + ", score=" + score
				+ "]";
	}

}
