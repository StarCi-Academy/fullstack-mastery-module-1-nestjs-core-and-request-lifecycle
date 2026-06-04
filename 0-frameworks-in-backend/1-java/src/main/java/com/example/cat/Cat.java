package com.example.cat;

// record Cat -> Jackson serializes in component order: {"id":..,"name":..}.
public record Cat(int id, String name) {
}
