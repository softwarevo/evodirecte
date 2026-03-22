import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Minus } from "lucide-react"
import { SiGithub } from '@icons-pack/react-simple-icons';

interface GistData {
  progress: number;
  eta: string;
  step: string;
  message: string;
  earlyAccess: boolean;
}

export default function App() {
  const [data, setData] = useState<GistData | null>(null)
  const [fakeProgress, setFakeProgress] = useState(0)
  const [isPixelated, setIsPixelated] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const searchParams = useMemo(() => new URLSearchParams(window.location.search), [])

  // Check for cameFrom=evoMoyenne
  useEffect(() => {
    if (searchParams.get("cameFrom") === "evoMoyenne") {
      setIsDialogOpen(true)
    }
  }, [searchParams])

  // Fetch
  useEffect(() => {
    fetch("https://gist.githubusercontent.com/adouche-adouche/99008eaffce2671da075d9cc8f8a404e/raw")
      .then(res => res.json())
      .then((json: GistData) => {
        setData(json)
        setFakeProgress(json.progress)
      })
      .catch(err => console.error("Erreur de fetch:", err))
  }, [])

  // Fausse progression
  useEffect(() => {
    if (!data) return;
    const interval = setInterval(() => {
      setFakeProgress(prev => Math.min(prev + 0.1, 100))
    }, 5000)
    return () => clearInterval(interval)
  }, [data])

  // Gestion du double clic sur le logo
  const handleLogoDoubleClick = () => {
    setIsPixelated(true)
    setTimeout(() => setIsPixelated(false), 3000)
  }

  // Gestion du bouton Early Access
  const handleSeedlingClick = () => {
    if (data?.earlyAccess) {
      window.location.href = "https://seedling.evodirecte.qzz.io"
    } else {
      alert("evoDirecte Seedling (la version bêta) sera disponible au public bientôt !")
    }
  }

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto p-6 font-sans">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              🫡 Adieu, evoMoyenne…
            </DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                Nous avons décidé d’abandonner evoMoyenne pour un tout nouveau projet nommé <strong>evoDirecte</strong>.
              </p>
              <p>
                Rassurez-vous : evoDirecte contiendra toutes les fonctionnalités d’evoMoyenne, et même plus ! Devoirs, absences, messages, emploi du temps et bien plus. En fait, c’est comme le vrai EcoleDirecte… Mais en mieux !
              </p>
              <p>
                On vous laisse explorer cette page pour en savoir plus sur le futur de votre assistant scolaire.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" size="lg" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Super
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HEADER */}
      <header className="flex justify-between items-center py-6">
        <img 
          src="/logo.svg" 
          alt="evoDirecte Logo" 
          onDoubleClick={handleLogoDoubleClick}
          className={`h-12 w-12 cursor-pointer transition-all dark:invert ${isPixelated ? 'pixelated' : ''}`} 
          style={{ imageRendering: isPixelated ? 'pixelated' : 'auto' }}
        />
        <a href="https://github.evodirecte.qzz.io" target="_blank" rel="noreferrer">
          <SiGithub className="h-10 w-10" />
        </a>
      </header>

      {/* HERO */}
      <main className="flex-grow space-y-12 mt-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">🏗️ evoDirecte est en chantier.</h1>
          <h2 className="text-xl text-muted-foreground">evoDirecte, c’est ton assistant scolaire indispensable.</h2>
        </div>

        {/* PROGRESSION */}
        {data && (
          <div className="space-y-6 bg-secondary/20 p-6 rounded-xl border">
            <div>
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Avancement</span>
                <span>{fakeProgress.toFixed(1)}%</span>
              </div>
              <Progress value={fakeProgress} className="h-3" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-muted-foreground">Date de sortie estimée</p>
                <p>{data.eta}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">{data.step}</p>
                <p>{data.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* COMPARAISON */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-center">evoDirecte vs EcoleDirecte</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fonctionnalité</TableHead>
                <TableHead className="text-center">EcoleDirecte</TableHead>
                <TableHead className="text-center text-primary">evoDirecte</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Mode Sombre Natif</TableCell>
                <TableCell className="text-center"><X className="mx-auto text-destructive h-5 w-5" /></TableCell>
                <TableCell className="text-center"><Check className="mx-auto text-green-500 h-5 w-5" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Signalement des devoirs non entrés</TableCell>
                <TableCell className="text-center"><X className="mx-auto text-destructive h-5 w-5" /></TableCell>
                <TableCell className="text-center"><Check className="mx-auto text-green-500 h-5 w-5" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Interface Fluide & Rapide</TableCell>
                <TableCell className="text-center"><X className="mx-auto text-destructive h-5 w-5" /></TableCell>
                <TableCell className="text-center"><Check className="mx-auto text-green-500 h-5 w-5" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Organisation des devoirs par priorité</TableCell>
                <TableCell className="text-center"><Minus className="mx-auto text-yellow-500 h-5 w-5" /></TableCell>
                <TableCell className="text-center"><Check className="mx-auto text-green-500 h-5 w-5" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Moyennes et partage de notes</TableCell>
                <TableCell className="text-center"><X className="mx-auto text-destructive h-5 w-5" /></TableCell>
                <TableCell className="text-center"><Check className="mx-auto text-green-500 h-5 w-5" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Système d'amis</TableCell>
                <TableCell className="text-center"><X className="mx-auto text-destructive h-5 w-5" /></TableCell>
                <TableCell className="text-center"><Check className="mx-auto text-green-500 h-5 w-5" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-bold">Tu veux tester evoDirecte en avance ?</h2>
          <Button size="lg" onClick={handleSeedlingClick}>
            Ouvrir evoDirecte Seedling
          </Button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        Fait avec 🍪 et 🧋 par <a href="https://github.com/softwarevo" className="underline hover:text-primary">evoSoftware</a>
      </footer>
    </div>
  )
}
