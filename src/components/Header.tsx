import { Calculator, ChevronDown, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navItems = [
  {
    label: "Core Calculators",
    href: "/",
    subItems: [
      { label: "Mortgage Calculator", href: "/" },
      { label: "Mortgage Affordability", href: "/house-affordability" },
      { label: "Rent or Buy", href: "/rent-or-buy" },
      { label: "Mortgage Qualification", href: "/mortgage-qualification-calculator" },
    ],
  },
  {
    label: "Loan Programs",
    href: "/fha-loan-calculator",
    subItems: [
      { label: "Conventional", href: "/conventional-mortgage-calculator" },
      { label: "FHA Loan", href: "/fha-loan-calculator" },
      { label: "USDA Loan", href: "/usda-loan-calculator" },
      { label: "VA Loan", href: "/va-loan-calculator" },
      { label: "Jumbo", href: "/jumbo-loan-calculator" },
      { label: "ARM", href: "/adjustable-rate-mortgage-calculator" },
    ],
  },
  {
    label: "Refinancing & Home Equity",
    mobileLabel: "Refinance & Equity",
    href: "/refinance-calculator",
    subItems: [
      { label: "Refinance", href: "/refinance-calculator" },
      { label: "Cash-Out Refi", href: "/cash-out-refinance-calculator" },
      { label: "HELOC", href: "/heloc-calculator" },
      { label: "Second Mortgage", href: "/second-mortgage-calculator" },
    ],
  },
  {
    label: "Savings Strategies",
    href: "/extra-mortgage-payments-calculator",
    subItems: [
      { label: "Extra Payments", href: "/extra-mortgage-payments-calculator" },
      { label: "Bi-Weekly Payments", href: "/bi-weekly-mortgage-payments-calculator" },
    ],
  },
];

const Header = () => {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const toggleSection = (label: string) => {
    setOpenSections((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container py-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-display font-bold text-foreground hover:text-primary transition-colors"
          >
            <img src="/favicon.png" alt="" className="h-6 w-6" aria-hidden="true" />
            <span>Mortgage Calculation</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {/* AI Button - standalone link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/mortgage-assistant"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                  >
                    <Sparkles className="h-4 w-4" />
                    Mortgage Assistant
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent whitespace-nowrap">
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

          {/* Mobile/Tablet Hamburger Menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 flex flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img src="/favicon.png" alt="" className="h-5 w-5" />
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex-1 overflow-y-auto">
                <ul className="flex flex-col gap-2" role="list">
                  {/* AI Link */}
                  <li>
                    <Link
                      to="/mortgage-assistant"
                      onClick={() => setSheetOpen(false)}
                      className="flex items-center gap-2 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      Mortgage Assistant
                    </Link>
                  </li>

                  {navItems.map((item) => (
                    <li key={item.label}>
                      <Collapsible
                        open={openSections.includes(item.label)}
                        onOpenChange={() => toggleSection(item.label)}
                      >
                        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-base font-medium text-foreground hover:text-primary transition-colors text-left">
                          {item.mobileLabel || item.label}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 transition-transform duration-200",
                              openSections.includes(item.label) && "rotate-180"
                            )}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <ul className="ml-4 flex flex-col gap-1 pb-2">
                            {item.subItems.map((subItem) => (
                              <li key={subItem.label}>
                                <Link
                                  to={subItem.href}
                                  onClick={() => setSheetOpen(false)}
                                  className="block py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
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
