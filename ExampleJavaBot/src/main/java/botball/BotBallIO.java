package botball;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.codehaus.jackson.map.ObjectMapper;

import botball.domain.CommandSet;
import botball.domain.SnapShot;

/**
 * @author Kriton
 */
public class BotBallIO {

	private static BufferedReader input;

	static {
		input = new BufferedReader(new InputStreamReader(System.in));
	}

	/**
	 * Return the Snapshot of the game.
	 * 
	 * @return
	 * @throws IOException 
	 * @throws InterruptedException 
	 */
	public static SnapShot read() throws IOException, InterruptedException {
		String line = input.readLine();
		
		ObjectMapper mapper = new ObjectMapper();
		SnapShot snapShot = mapper.readValue(line, SnapShot.class);
		if (snapShot==null){
			throw new IOException("<"+line + "> could not be mapped to a Snapshot");
		}
		
		return snapShot ;
	}

	/**
	 * Publishes the commands to the game
	 * @param commands
	 */
	public static void write(CommandSet commands)  {
		System.out.println(commands);
	}

	/**
	 * Publishes to stderr for debugging
	 * @param s
	 */
	public static void debug(String s)  {
		System.err.println(s);
	}

}
