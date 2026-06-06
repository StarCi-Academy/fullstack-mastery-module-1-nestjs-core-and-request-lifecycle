// Package cat is the "cat" bounded context — equivalent to a NestJS CatModule.
// It owns its own data type (Cat) and business logic (Service). Other packages
// access it only through the exported API (All, SpyHint), mirroring the
// exports/imports contract of a NestJS module.
package cat

// Cat is a single cat record serialised as {"id":.., "name":..} in JSON.
type Cat struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// Service holds the cat dataset and exposes public query methods.
// In Go there is no IoC container, so the caller (main) creates this struct
// manually — the composition-root pattern achieves the same inversion-of-control
// intent as NestJS @Injectable() + @Module providers.
type Service struct {
	cats []Cat
}

// NewService constructs a Service pre-seeded with static demo data.
// Called once at the composition root (main); the returned pointer is the
// shared singleton — passed by reference to dog.NewService.
func NewService() *Service {
	// Static seed keeps the lesson focused on DI rather than database setup.
	return &Service{cats: []Cat{{ID: 1, Name: "Milo"}, {ID: 2, Name: "Luna"}}}
}

// All returns the full cat list. Consumed by GET /cats and by dog.Service
// via the injected pointer — proving both callers share the same instance.
func (s *Service) All() []Cat {
	return s.cats
}

// SpyHint returns a status string consumed by dog.Service to demonstrate
// cross-package dependency access without creating a second Service instance.
func (s *Service) SpyHint() string {
	return "cat-network-ready"
}
