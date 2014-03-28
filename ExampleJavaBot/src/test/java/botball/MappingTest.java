package botball;

import junit.framework.Assert;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;

import botball.domain.SnapShot;

public class MappingTest {
	@Test
	public void test() throws Exception {
		String line = "{" + "\"yourBot\":0," + "\"player0\":[\"0,0\",\"0,5\",\"0,10\",\"0,15\",\"0,20\"],"
				+ "\"player1\":[\"28,0\",\"22,5\",\"21,10\",\"25,15\",\"29,20\"]," + "\"ball\":\"14,10\"," + "\"score\":\"0:0\"" + "}";
		ObjectMapper mapper = new ObjectMapper();
		SnapShot snapShot = mapper.readValue(line, SnapShot.class);
		String expected = "SnapShot [yourBot=0, player0=[(0, 0), (0, 5), (0, 10), (0, 15), (0, 20)], "
				+ "player1=[(28, 0), (22, 5), (21, 10), (25, 15), (29, 20)], ball=(14, 10), score=0:0]";
		Assert.assertEquals(expected, snapShot.toString());
	}
}
