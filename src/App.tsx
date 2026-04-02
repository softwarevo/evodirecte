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
import { Check, X, Minus, Clock } from "lucide-react"
import { SiGithub } from '@icons-pack/react-simple-icons';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { format, parse, differenceInDays, differenceInHours, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GistData {
  startDate: string;
  eta: string;
  step: string;
  message: string;
  earlyAccess: boolean;
}

const EvoDirecteWord = ({ children }: { children: React.ReactNode }) => {
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className="cursor-pointer select-none"
    >
      {children}
    </span>
  );
};

export default function App() {
  const [data, setData] = useState<GistData | null>(null)
  const [isPixelated, setIsPixelated] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [now, setNow] = useState(new Date())

  const searchParams = useMemo(() => new URLSearchParams(window.location.search), [])

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Check for cameFrom=evoMoyenne
  useEffect(() => {
    const checkParams = () => {
      if (searchParams.get("cameFrom") === "evoMoyenne") {
        setIsDialogOpen(true)
      }
    }
    // Use a small timeout to avoid the synchronous setState warning
    const timeout = setTimeout(checkParams, 0)
    return () => clearTimeout(timeout)
  }, [searchParams])

  // Fetch
  useEffect(() => {
    fetch("https://gist.githubusercontent.com/adouche-adouche/99008eaffce2671da075d9cc8f8a404e/raw")
      .then(async res => {
        const text = await res.text();
        // The gist has a syntax error (missing comma after startDate), so we try to fix it
        try {
          return JSON.parse(text);
        } catch (firstParseError) {
          console.error("Erreur lors du premier JSON.parse du gist, tentative de correction du texte :", firstParseError);
          console.error("Erreur lors du premier JSON.parse du gist, tentative de correction du texte :", firstParseError);
          try {
            return JSON.parse(fixedText);
          } catch (secondParseError) {
            console.error("Erreur lors du second JSON.parse après correction du gist :", secondParseError);
            throw new Error("Impossible d'analyser le contenu du gist même après tentative de correction.");
          }
          try {
            return JSON.parse(fixedText);
          } catch (secondParseError) {
            console.error("Erreur lors du second JSON.parse après correction du gist :", secondParseError);
            throw new Error("Impossible d'analyser le contenu du gist même après tentative de correction.");
          }
        }
      })
      .then((json: GistData) => {
        setData(json)
      })
      .catch(err => console.error("Erreur de fetch:", err))
  }, [])

  const { progress, progressText, etaDate, remainingTime } = useMemo(() => {
    if (!data) return { progress: 0, progressText: "Chargement...", etaDate: null, remainingTime: null };

    const start = parse(data.startDate, "dd/MM/yyyy", new Date());
    const eta = parse(data.eta, "dd/MM/yyyy", new Date());

    if (isBefore(now, start)) {
      return {
        progress: 0,
        progressText: "pas encore commencé",
        etaDate: eta,
        remainingTime: null
      };
    }

    const total = eta.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    const calculatedProgress = Math.min(Math.max((current / total) * 100, 0), 100);

    const days = differenceInDays(eta, now);
    const hours = differenceInHours(eta, now) % 24;

    return {
      progress: calculatedProgress,
      progressText: `${calculatedProgress.toFixed(1)}%`,
      etaDate: eta,
      remainingTime: isAfter(eta, now) ? { days, hours } : null
    };
  }, [data, now]);

  const formattedEta = useMemo(() => {
    if (!etaDate) return "";
    const currentYear = new Date().getFullYear();
    const etaYear = etaDate.getFullYear();
    const pattern = etaYear === currentYear ? "EEEE d MMMM" : "EEEE d MMMM yyyy";
    return format(etaDate, pattern, { locale: fr });
  }, [etaDate]);

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

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

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
                Nous avons décidé d’abandonner evoMoyenne pour un tout nouveau projet nommé <strong><EvoDirecteWord>evoDirecte</EvoDirecteWord></strong>.
              </p>
              <p>
                Rassurez-vous : <strong><EvoDirecteWord>evoDirecte</EvoDirecteWord></strong> contiendra toutes les fonctionnalités d’evoMoyenne, et même plus ! Devoirs, absences, messages, emploi du temps, révisions intelligentes et bien plus. En fait, c’est comme le vrai EcoleDirecte… Mais en mieux !
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
        <button
          type="button"

          aria-label="Activer l’easter egg du logo evoDirecte"
          className="bg-transparent border-none p-0 cursor-pointer"
        >
          <img 
            src="/logo.svg" 
            alt="evoDirecte Logo" 
            className={`h-12 w-12 transition-all dark:invert ${isPixelated ? 'pixelated' : ''}`} 
            style={{ imageRendering: isPixelated ? 'pixelated' : 'auto' }}
          />
        </button>
          type="button"
          onDoubleClick={handleLogoDoubleClick}
          aria-label="Activer l’easter egg du logo evoDirecte"
          className="bg-transparent border-none p-0 cursor-pointer"
        >
          <img 
            src="/logo.svg" 
            alt="evoDirecte Logo" 
            className={`h-12 w-12 transition-all dark:invert ${isPixelated ? 'pixelated' : ''}`} 
            style={{ imageRendering: isPixelated ? 'pixelated' : 'auto' }}
        <a
          href="https://github.evodirecte.qzz.io"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Ouvrir le dépôt GitHub dans un nouvel onglet"
        >
        </button>

        <div className="flex-1 flex justify-center">
          {remainingTime && (
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
              <Clock className="h-4 w-4" />
              <span>J-{remainingTime.days} {remainingTime.hours}h</span>
            </div>
          )}
        </div>

        <a
          href="https://github.evodirecte.qzz.io"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Ouvrir le dépôt GitHub dans un nouvel onglet"
        >
          <SiGithub className="h-10 w-10" />
        </a>
      </header>

      {/* HERO */}
      <main className="flex-grow space-y-12 mt-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">🏗️ <EvoDirecteWord>evoDirecte</EvoDirecteWord> est en chantier.</h1>
          <h2 className="text-xl text-muted-foreground"><EvoDirecteWord>evoDirecte</EvoDirecteWord>, c’est ton assistant scolaire indispensable.</h2>
        </motion.div>

        {/* PROGRESSION */}
        {data && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="space-y-6 bg-secondary/20 p-6 rounded-xl border"
          >
            <div>
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Avancement</span>
                <span>{progressText}</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-muted-foreground">Date de sortie estimée</p>
                <p className="capitalize">{formattedEta}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">{data.step}</p>
                <p>{data.message}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* COMPARAISON */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="space-y-4"
        >
          <h3 className="text-2xl font-semibold text-center"><EvoDirecteWord>evoDirecte</EvoDirecteWord> 🗿 vs EcoleDirecte 💩</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fonctionnalité</TableHead>
                <TableHead className="text-center">EcoleDirecte</TableHead>
                <TableHead className="text-center text-primary"><EvoDirecteWord>evoDirecte</EvoDirecteWord></TableHead>
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
              <TableRow>
                <TableCell>Leçons type Duolingo et évals blanches fictives</TableCell>
                <TableCell className="text-center"><X className="mx-auto text-destructive h-5 w-5" /></TableCell>
                <TableCell className="text-center"><Check className="mx-auto text-green-500 h-5 w-5" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="text-center space-y-4 py-12"
        >
          <h2 className="text-3xl font-bold">Tu veux tester <EvoDirecteWord>evoDirecte</EvoDirecteWord> en avance ?</h2>
          <div className="flex flex-col items-center gap-2">
            <Button size="lg" onClick={handleSeedlingClick}>
              Ouvrir evoDirecte Seedling
            </Button>
            <p className="text-sm text-muted-foreground/60">
              Teste evoDirecte en avant-première et obtiens un badge spécial dans l’app finale
            </p>
          </div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        Fait avec 🍪 et 🧋 par <a href="https://github.com/softwarevo" className="underline hover:text-primary">evoSoftware</a>
      </footer>
    </div>
  )
}
