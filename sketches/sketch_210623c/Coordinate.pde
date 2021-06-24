
public class Coordinate {
    public boolean isroot = false;
    public String hash = "";
    public int col;
    public int row;
    public float x;
    public float y;
    public float w;
    public float h;
    public boolean used = false;

    public Coordinate(){}

    public Coordinate(int col, int row, float x, float y) {
        this.row = row;
        this.col = col;
        this.x = x;
        this.y = y;
        hash = new StringBuilder(row).append('-').append(col).toString();
        this.hash = new MD5().getMd5(hash).toString();
    }

}
