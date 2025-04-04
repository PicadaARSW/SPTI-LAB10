package edu.eci.arsw.blueprints.model;

import java.util.*;

/**
 * Representa un blueprint con un autor, nombre y una lista de puntos.
 */
public class Blueprint {

    private String author=null;
    
    private List<Point> points=null;
    
    private String name=null;
            
    public Blueprint(String author,String name,Point[] pnts){
        this.author=author;
        this.name=name;
        points=Arrays.asList(pnts);
    }

    public Blueprint() {
    }    
    
    public String getName() {
        return name;
    }

    public String getAuthor() {
        return author;
    }
    
    public List<Point> getPoints() {
        return points;
    }
    
    public void addPoint(Point p){
        this.points.add(p);
    }

    @Override
    public String toString() {
        return "Blueprint{" + "author=" + author + ", name=" + name + '}';
    }

    @Override
    public int hashCode() {
        return 7;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Blueprint other = (Blueprint) obj;
        if (!Objects.equals(this.author, other.author)) {
            return false;
        }
        if (!Objects.equals(this.name, other.name)) {
            return false;
        }
        if (this.points.size()!=other.points.size()){
            return false;
        }
        for (int i=0;i<this.points.size();i++){
            if (this.points.get(i)!=other.points.get(i)){
                return false;
            }
        }
        
        return true;
    }
    
    
    
}
