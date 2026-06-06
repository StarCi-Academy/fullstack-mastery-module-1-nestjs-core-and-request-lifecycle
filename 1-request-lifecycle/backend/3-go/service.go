// Package main implements the request/response lifecycle demo with Gin.
package main

import "fmt"

// Item is a single item record in the in-memory store.
type Item struct {
	// ID is the identifier key of the item.
	ID int `json:"id"`
	// Name is the display name of the item.
	Name string `json:"name"`
}

// ItemsService provides in-memory item data so the lesson focuses on the pipeline.
type ItemsService struct{}

// NewItemsService constructs a new ItemsService.
func NewItemsService() *ItemsService {
	return &ItemsService{}
}

// List returns the sample item list for the list endpoint.
func (s *ItemsService) List() []Item {
	// Return in-memory data so there is no DB dependency.
	return []Item{
		{ID: 1, Name: "keyboard"},
		{ID: 2, Name: "mouse"},
	}
}

// FindByID returns the item detail by id that has passed validation.
func (s *ItemsService) FindByID(id int) Item {
	// Log to prove the handler does NOT run when validation blocks bad input.
	fmt.Printf("[service] FindByID(%d)\n", id)
	return Item{ID: id, Name: fmt.Sprintf("item-%d", id)}
}
