package botball;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import botball.strategy.Strategy;

/**
 * @author Kriton
 */
public class Bot {
	@Autowired
	Strategy strategy;

	protected void run() throws Exception {
		while (true) {
			BotBallIO.write(this.strategy.execute(BotBallIO.read()));
		}
	}

	public static void main(String[] args) throws Exception {

		ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] { "application-context.xml" });

		BotBallIO.debug("Hello Bot World!");
		context.getBean(Bot.class).run();

	}
}
