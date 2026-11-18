import { ArrowRight, Menu, Sparkles, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { calculatorGroups } from "@/lib/calculators";

const Header = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { pathname } = useLocation();
  const isCurrent = (path: string) => pathname === path || `${pathname}/` === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="container py-3">
        <nav className="flex items-center justify-between gap-4" aria-label="Main navigation">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg sm:text-xl font-display font-bold text-foreground hover:text-primary transition-colors"
          >
            <img src="/logo-64.png" width={28} height={28} alt="" className="h-7 w-7" aria-hidden="true" />
            <span>MortgageCalculation.net</span>
          </Link>

          {/* Desktop: one menu per goal, each item with a one-line description */}
          <NavigationMenu className="hidden xl:flex">
            <NavigationMenuList className="gap-1">
              {calculatorGroups.map((group) => (
                <NavigationMenuItem key={group.id}>
                  <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground">
                    {group.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className={cn("grid gap-1 p-3", group.calculators.length > 3 ? "w-[560px] grid-cols-2" : "w-[300px]")}>
                      {group.calculators.map((calc) => (
                        <li key={calc.path}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={calc.path}
                              aria-current={isCurrent(calc.path) ? "page" : undefined}
                              className={cn(
                                "flex gap-3 rounded-xl p-3 outline-none transition-colors hover:bg-secondary focus-visible:bg-secondary",
                                isCurrent(calc.path) && "bg-secondary",
                              )}
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <calc.icon className="h-4 w-4" aria-hidden="true" />
                              </span>
                              <span>
                                <span className="block text-sm font-semibold text-foreground">{calc.name}</span>
                                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{calc.description}</span>
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className={cn("border-t border-border pt-1", group.calculators.length > 3 && "col-span-2")}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={group.hubPath}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-primary outline-none transition-colors hover:bg-secondary focus-visible:bg-secondary"
                          >
                            Compare all {group.calculators.length} side by side
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/mortgage-assistant/"
                    className="ml-1 flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                  >
                    <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                    Ask the assistant
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Phones and tablets: every calculator, grouped, in one scrollable panel */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="xl:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[88vw] max-w-sm flex-col p-0">
              <SheetHeader className="border-b border-border px-5 py-4 text-left">
                <SheetTitle className="flex items-center gap-2 text-base">
                  <LayoutGrid className="h-4 w-4 text-primary" aria-hidden="true" />
                  All calculators
                </SheetTitle>
              </SheetHeader>
              <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Calculators">
                {calculatorGroups.map((group) => (
                  <div key={group.id} className="mb-5">
                    <Link
                      to={group.hubPath}
                      onClick={() => setSheetOpen(false)}
                      className="flex items-center justify-between rounded-md px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                    >
                      {group.title}
                      <span className="flex items-center gap-0.5 normal-case tracking-normal text-primary">
                        See all
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </Link>
                    <ul role="list">
                      {group.calculators.map((calc) => (
                        <li key={calc.path}>
                          <Link
                            to={calc.path}
                            onClick={() => setSheetOpen(false)}
                            aria-current={isCurrent(calc.path) ? "page" : undefined}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary",
                              isCurrent(calc.path) && "bg-secondary",
                            )}
                          >
                            <calc.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                            {calc.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link
                  to="/mortgage-assistant/"
                  onClick={() => setSheetOpen(false)}
                  className="mx-2 flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                  Not sure which one? Ask the assistant
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;
