// package cat is the "cat" module — its own bounded context.
package cat

// Cat is a single cat record returned to the client.
type Cat struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// Service holds cat data + public methods. Equivalent to CatService.
type Service struct {
	cats []Cat
}

// NewService is the constructor — Go has no IoC container, so the
// composition root calls it explicitly (manual DI).)
func NewService() *Service {
	return &Service{cats: []Cat{{ID: 1, Name: "Milo"}, {ID: 2, Name: "Luna"}}}
}

// All returns every cat (used by GET /cats).
func (s *Service) All() []Cat {
	return s.cats
}

// SpyHint is the "exported" piece consumed by the dog module via DI.
func (s *Service) SpyHint() string {
	return "cat-network-ready"
}
