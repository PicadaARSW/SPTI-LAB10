package edu.eci.arsw.blueprints.persistence.impl;

import java.util.Objects;

/**
 * Clase genérica Tuple que representa un par de valores.
 * @param <T1> Tipo del primer elemento de la tupla.
 * @param <T2> Tipo del segundo elemento de la tupla.
 */
public class Tuple<T1, T2> {

    T1 o1;
    T2 o2;

    public Tuple(T1 o1, T2 o2) {
        super();
        this.o1 = o1;
        this.o2 = o2;
    }

    public T1 getElem1() {
        return o1;
    }

    public T2 getElem2() {
        return o2;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 17 * hash + Objects.hashCode(this.o1);
        hash = 17 * hash + Objects.hashCode(this.o2);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        return this == obj || (obj != null
                && getClass() == obj.getClass()
                && Objects.equals(this.o1, ((Tuple<?, ?>) obj).o1)
                && Objects.equals(this.o2, ((Tuple<?, ?>) obj).o2));
    }
    
    
}
