// package dog is the "dog" module — depends on cat.Service via manual DI.
package dog

import "frameworks-demo/cat"

// SpyReport keeps a fixed field order (struct, not map) to match output.
type SpyReport struct {
	Mission    string `json:"mission"`
	Dependency string `json:"dependency"`
	Status     string `json:"status"`
}

// CatsView = the "dog borrows cats via DI" report — proves same instance.
type CatsView struct {
	Dog          string    `json:"dog"`
	BorrowedCats []cat.Cat `json:"borrowedCats"`
}

// Service does NOT create cat.Service — it only receives it via the constructor.
type Service struct {
	cats *cat.Service
}

// NewService receives a *cat.Service: creation control is inverted to the root.
func NewService(c *cat.Service) *Service {
	return &Service{cats: c}
}

// SpyReport calls across the "module" boundary into the injected cat.Service.
func (s *Service) SpyReport() SpyReport {
	return SpyReport{
		Mission:    "cross-module-dependency-check",
		Dependency: s.cats.SpyHint(),
		Status:     "ok",
	}
}

// CatsViaDI reuses the exact cat.Service instance (shared singleton).
func (s *Service) CatsViaDI() CatsView {
	return CatsView{Dog: "Rex", BorrowedCats: s.cats.All()}
}
