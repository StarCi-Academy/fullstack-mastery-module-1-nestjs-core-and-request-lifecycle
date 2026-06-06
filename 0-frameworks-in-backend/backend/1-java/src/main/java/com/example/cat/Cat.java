package com.example.cat;

/**
 * Immutable data record representing a single cat.
 *
 * <p>Jackson serializes component fields in declaration order:
 * {@code {"id": .., "name": ..}}, matching the API contract.
 *
 * @param id   unique identifier of the cat
 * @param name display name of the cat
 */
public record Cat(int id, String name) {
}
