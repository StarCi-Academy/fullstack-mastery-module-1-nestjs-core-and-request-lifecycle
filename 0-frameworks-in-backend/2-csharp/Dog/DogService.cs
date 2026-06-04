using FrameworksDemo.Cat;

// the dog "module" — depends on CatService via constructor injection.
namespace FrameworksDemo.Dog;

public class DogService
{
    private readonly CatService _cats;

    // constructor injection: the container reads the parameter type and supplies
    // CatService. No "new CatService()" here (inversion of control).)
    public DogService(CatService cats) => _cats = cats;

    // the anonymous object keeps declaration order -> {mission, dependency, status}.
    public object SpyReport() => new
    {
        mission = "cross-module-dependency-check",
        dependency = _cats.SpyHint(),
        status = "ok",
    };

    // reuses the same CatService instance (registered Singleton) -> same /cats data.
    public object CatsViaDI() => new { dog = "Rex", borrowedCats = _cats.All() };
}
