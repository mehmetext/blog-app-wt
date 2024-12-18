import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com",
    label: "Github",
  },
  {
    icon: Twitter,
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: Mail,
    href: "mailto:contact@example.com",
    label: "Email",
  },
];

const footerLinks = [
  {
    title: "Sayfalar",
    links: [
      { label: "Ana Sayfa", href: "/" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { label: "Gizlilik Politikası", href: "/privacy" },
      { label: "Kullanım Koşulları", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo ve Sosyal Medya */}
          <div className="flex flex-col gap-4 items-start">
            <Link href="/" className="text-xl font-bold">
              Blog App
            </Link>
            <p className="text-sm text-muted-foreground">
              Web teknolojileri dersi için geliştirilmiş bir blog uygulaması.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Linkleri */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt Bilgi */}
        <div className="mt-12 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blog App. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
