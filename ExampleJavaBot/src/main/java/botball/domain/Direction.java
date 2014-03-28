package botball.domain;

/**
 * @author Kriton
 */
public enum Direction {
	//East is deemed the best direction followed by derivatives, south is deemed better than north, west is the worse (that would mean going backward!)
	//This depends which way we are shooting though if we are shooting west the order is reversed
	E, 
	SE, 
	NE, 
	N, 
	NODIRECTION { 
		public String toString(){
			return "";
		}
	},
	S, 
	SW, 
	NW, 
	W;
	
	
}
