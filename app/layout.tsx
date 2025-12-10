import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/layout/ThemeProvider"

// Removido Google Fonts temporariamente para melhor performance
// Usando fonte system em vez disso

export const metadata: Metadata = {
  title: "CondoAssist Dashboard - Gestão de Condomínios",
  description: "Sistema de Gestão e Analytics para Administração de Condomínios",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
