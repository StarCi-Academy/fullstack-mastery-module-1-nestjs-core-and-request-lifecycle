// Package dog is the "dog" bounded context — depends on cat.Service via manual DI.
// It mirrors a NestJS DogModule that imports CatModule: dog.Service holds a
// reference to cat.Service injected at construction time, never created internally.
package dog

import "frameworks-demo/cat"

// SpyReport is the response body for GET /dogs/spy.
// Struct (not map) keeps JSON field order deterministic:
// {"mission":.., "dependency":.., "status":..}.
type SpyReport struct {
	Mission    string `json:"mission"`
	Dependency string `json:"dependency"`
	Status     string `json:"status"`
}

// CatsView is the response body for GET /dogs/cats-via-di.
// Contains the dog name and the full cat list borrowed via the injected service.
type CatsView struct {
	Dog          string    `json:"dog"`
	BorrowedCats []cat.Cat `json:"borrowedCats"`
}

// Service is the business-logic layer for the dog domain.
// It does NOT create cat.Service — creation is inverted to the composition root.
type Service struct {
	// cats is the injected cat.Service pointer — same instance used by CatController.
	cats *cat.Service
}

// NewService accepts the shared *cat.Service from the composition root.
// This is manual inversion of control: dog does not own cat's lifecycle.
func NewService(c *cat.Service) *Service {
	return &Service{cats: c}
}

// SpyReport builds a cross-package dependency report, calling cat.Service across
// the package boundary. Proves that DI resolves the dependency without new().
func (s *Service) SpyReport() SpyReport {
	return SpyReport{
		Mission: "cross-module-dependency-check",
		// SpyHint() crosses the package boundary via the injected pointer — no new cat.Service().
		Dependency: s.cats.SpyHint(),
		Status:     "ok",
	}
}

// CatsViaDI returns the full cat list borrowed from the injected cat.Service.
// Because s.cats is the same pointer as catSvc in main, this proves shared singleton.
func (s *Service) CatsViaDI() CatsView {
	// Reuse the injected cat.Service singleton — same data as GET /cats.
	return CatsView{Dog: "Rex", BorrowedCats: s.cats.All()}
}
