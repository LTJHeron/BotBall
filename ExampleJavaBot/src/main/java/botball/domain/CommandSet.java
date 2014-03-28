package botball.domain;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @author Kriton
 */
public class CommandSet {

	private final Command c1 ;
	private final Command c2 ;
	private final Command c3 ;
	private final Command c4 ;
	private final Command c5 ;
	
	public CommandSet(Command c1, Command c2, Command c3, Command c4, Command c5) {
		this.c1 = c1;
		this.c2 = c2;
		this.c3 = c3;
		this.c4 = c4;
		this.c5 = c5;
	}
	
	public String toString(){
		return "{\"commands\" : [ " + c1 + "," + c2 + "," + c3 + "," + c4 + "," + c5 + "]}" ;
	}
	
	public List<Command> asList(){
		return Collections.unmodifiableList(Arrays.asList(c1, c2, c3, c4, c5));
	}
	
	public Command getC1() {
		return c1;
	}

	public Command getC2() {
		return c2;
	}

	public Command getC3() {
		return c3;
	}

	public Command getC4() {
		return c4;
	}

	public Command getC5() {
		return c5;
	}
}
