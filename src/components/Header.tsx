import { Calculator, Menu, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

const navItems = [
  {
    label: "Core Calculators",
    href: "/",
    subItems: [
      { label: "Mortgage Calculator", href: "/" },
      { label: "Mortgage Affordability", href: "/affordability" },
      { label: "Rent or Buy", href: "/rent-or-buy" },
      { label: "Mortgage Qualification", href: "/qualification" },
    ],
  },
  {
    label: "Loan Programs",
    href: "/fha",
    subItems: [
      { label: "Conventional", href: "/conventional" },
      { label: "FHA Loan", href: "/fha" },
      { label: "USDA Loan", href: "/usda" },
      { label: "VA Loan", href: "/va" },
      { label: "Jumbo", href: "/jumbo" },
      { label: "ARM", href: "/arm" },
    ],
  },
  {
    label: "Refinancing & Home Equity",
    href: "/refinance",
    subItems: [
      { label: "Refinance", href: "/refinance" },
      { label: "Cash-Out Refi", href: "/cash-out-refinance" },
      { label: "HELOC", href: "/heloc" },
      { label: "Second Mortgage", href: "/second-mortgage" },
    ],
  },
  {
    label: "Savings Strategies",
    href: "/extra-payments",
    subItems: [
      { label: "Extra Payments", href: "/extra-payments" },
      { label: "Bi-Weekly Payments", href: "/bi-weekly-payments" },
    ],
  },
];

const Header = () => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container py-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-display font-bold text-foreground hover:text-primary transition-colors"
          >
            <Calculator className="h-6 w-6 text-accent" aria-hidden="true" />
            <span>Mortgage Calculation</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* AI Button - standalone link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/ai"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    Mortgage Assistant
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-48 gap-1 p-2">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.label}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={subItem.href}
                              className={cn(
                                "block select-none rounded-md px-3 py-2 text-sm leading-none no-underline outline-none transition-colors",
                                "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              {subItem.label}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Hamburger Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-accent" />
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6">
                <ul className="flex flex-col gap-4" role="list">
                  {/* AI Link */}
                  <li>
                    <Link
                      to="/ai"
                      className="flex items-center gap-2 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      Mortgage Assistant
                    </Link>
                  </li>

                  {navItems.map((item) => (
                    <li key={item.label}>
                      <span className="block py-2 text-base font-medium text-foreground">
                        {item.label}
                      </span>
                      <ul className="ml-4 flex flex-col gap-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.label}>
                            <Link
                              to={subItem.href}
                              className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;
