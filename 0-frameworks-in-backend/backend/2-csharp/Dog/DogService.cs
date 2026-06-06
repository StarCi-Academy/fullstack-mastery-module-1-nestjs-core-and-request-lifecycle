using FrameworksDemo.Cat;

// The dog "module" — depends on CatService via constructor injection.
namespace FrameworksDemo.Dog;

/// <summary>
/// Business-logic service for the dog domain.
/// <para>
/// Depends on <see cref="CatService"/> (a different namespace / "module") via
/// constructor injection. The ASP.NET container resolves <see cref="CatService"/>
/// automatically — no <c>new CatService()</c> in application code (inversion of control).
/// </para>
/// </summary>
public class DogService
{
    /// <summary>The injected <see cref="CatService"/> singleton — same instance used by the cat handler.</summary>
    private readonly CatService _cats;

    /// <summary>
    /// Constructor injection — the container reads the parameter type and supplies
    /// the registered <see cref="CatService"/> singleton. No <c>new</c> keyword required.
    /// </summary>
    /// <param name="cats">The singleton <see cref="CatService"/> managed by the IoC container.</param>
    public DogService(CatService cats) => _cats = cats;

    /// <summary>
    /// Build a spy report proving that <see cref="DogService"/> can call
    /// <see cref="CatService"/> across the namespace boundary via DI.
    /// </summary>
    /// <returns>
    /// Anonymous object serialized as
    /// <c>{"mission":..,"dependency":..,"status":..}</c>.
    /// Declaration order controls JSON field order for anonymous types.
    /// </returns>
    public object SpyReport() => new
    {
        mission = "cross-module-dependency-check",
        // SpyHint() crosses the namespace boundary — no new CatService() here.
        dependency = _cats.SpyHint(),
        status = "ok",
    };

    /// <summary>
    /// Return the full cat list borrowed via the injected <see cref="CatService"/> singleton.
    /// <para>
    /// Because <see cref="CatService"/> is registered as a singleton, <c>_cats.All()</c>
    /// returns the same data as a direct <c>GET /cats</c> call — same instance, same data.
    /// </para>
    /// </summary>
    /// <returns>Anonymous object serialized as <c>{"dog":..,"borrowedCats":[..]}</c>.</returns>
    public object CatsViaDI() => new { dog = "Rex", borrowedCats = _cats.All() };
}
