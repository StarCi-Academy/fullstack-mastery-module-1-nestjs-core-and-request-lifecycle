// Demo of "what a backend framework is" — Go uses gin (web framework) for
// routing. Key contrast: gin handles HTTP, but Go has no IoC container — creating
// and wiring dependencies (DI) is still manual at the composition root (main).)
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"frameworks-demo/cat"
	"frameworks-demo/dog"
)

func main() {
	// composition root: create + wire dependencies in one place (gin won't).
	catSvc := cat.NewService()       // module cat
	dogSvc := dog.NewService(catSvc) // inject cat.Service into dog.Service (same instance)

	r := gin.Default()
	r.GET("/cats", func(c *gin.Context) { c.JSON(http.StatusOK, catSvc.All()) })
	r.GET("/dogs/spy", func(c *gin.Context) { c.JSON(http.StatusOK, dogSvc.SpyReport()) })
	r.GET("/dogs/cats-via-di", func(c *gin.Context) { c.JSON(http.StatusOK, dogSvc.CatsViaDI()) })

	_ = r.Run(":3000")
}
