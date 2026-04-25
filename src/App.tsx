import { useState, useEffect, useMemo, useCallback, memo } from "react"
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
import { Check, X, Minus, Clock, Mail } from "lucide-react"
import { SiGithub, SiDiscord, SiWhatsapp } from '@icons-pack/react-simple-icons';
import confetti from 'canvas-confetti';
import { motion, type Variants } from 'framer-motion';
import { format, parse, differenceInDays, differenceInHours, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GistData {
  startDate: string;
  eta: string;
  step: string;
  message: string;
  earlyAccess: boolean;
}

const EVODIRECTE_DYNPROG_URL =
  "https://gist.githubusercontent.com/adouche-js/99008eaffce2671da075d9cc8f8a404e/raw/evodirecte_dynprog.json";

const EvoDirecteWord = memo(({ children }: { children: React.ReactNode }) => {
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Use the click position for confetti origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { x, y: y || 0.6 },
      zIndex: 9999,
    });
  };

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className="cursor-pointer select-none inline-block"
    >
      {children}
    </span>
  );
});

EvoDirecteWord.displayName = "EvoDirecteWord";

const ComparisonTable = memo(({ variants }: { variants: Variants }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
      className="space-y-4"
    >
      <h3 className="text-2xl font-semibold text-center"><EvoDirecteWord>Scool</EvoDirecteWord> 🗿 vs EcoleDirecte 💩</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fonctionnalité</TableHead>
            <TableHead className="text-center">EcoleDirecte</TableHead>
            <TableHead className="text-center text-primary"><EvoDirecteWord>Scool</EvoDirecteWord></TableHead>
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
  );
});

ComparisonTable.displayName = "ComparisonTable";

const Footer = memo(({ variants }: { variants: Variants }) => {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
      className="py-12 flex flex-col items-center gap-4 border-t mt-auto"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          title="Discord"
          asChild
        >
          <a
            href="https://discord.gg/" // There is no official server yet
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiDiscord style={{ color: '#5865F2' }} />
          </a>
        </Button>
        <Button
          variant="outline"
          size="icon"
          title="WhatsApp"
          asChild
        >
          <a
            href="https://whatsapp.com/channel/0029VbBrcnK8vd1QRpHDvk0H"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiWhatsapp style={{ color: '#25D366' }} />
          </a>
        </Button>
        <Button
          variant="outline"
          size="icon"
          title="Mail"
          asChild
        >
          <a href="mailto:evo@directe.qzz.io">
            <Mail className="text-black dark:text-white" />
          </a>
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Fait avec 🍪 et 🧋 par <a href="https://github.com/Scool-app" className="underline hover:text-primary">l'équipe Scool</a>
      </div>
    </motion.footer>
  );
});

Footer.displayName = "Footer";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function App() {
  const [data, setData] = useState<GistData | null>(null)
  const [isPixelated, setIsPixelated] = useState(false)
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), [])
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(() => searchParams.get("cameFrom") === "evoMoyenne")
  const [isSeedlingDialogOpen, setIsSeedlingDialogOpen] = useState(false)
  const [now, setNow] = useState(new Date())
  const [error, setError] = useState<string | null>(null)

  // Update clock every 10 seconds for more accurate countdown/status updates
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(timer)
  }, [])

  // Fetch
  useEffect(() => {
    const controller = new AbortController()

    fetch(EVODIRECTE_DYNPROG_URL, { signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((json: GistData) => {
        setData(json)
        setError(null)
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return
        }

        console.error("Fetch error:", err)

        let userMessage = "Impossible de charger les données. Veuillez réessayer plus tard."

        if (err instanceof SyntaxError) {
          userMessage = "Les données reçues sont invalides ou mal formatées."
        } else if (err instanceof TypeError) {
          userMessage = "Erreur réseau : vérifiez votre connexion internet puis réessayez."
        } else if (err instanceof Error && err.message.startsWith("HTTP error! status:")) {
          userMessage = "Le serveur a renvoyé une erreur lors du chargement des données."
        }

        setError(userMessage)
        setData(null)
      })

    return () => controller.abort()
  }, [])

  const { progress, progressText, etaDate, remainingTime } = useMemo(() => {
    if (error) {
      return { progress: 0, progressText: "Erreur de chargement", etaDate: null, remainingTime: null };
    }

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

    let remainingTime: { days: number; hours: number } | null = null;
    if (isAfter(eta, now)) {
      const totalHours = differenceInHours(eta, now);
      const days = differenceInDays(eta, now);
      const hours = totalHours % 24;
      remainingTime = { days, hours };
    }

    return {
      progress: calculatedProgress,
      progressText: `${calculatedProgress.toFixed(1)}%`,
      etaDate: eta,
      remainingTime
    };
  }, [data, now, error]);

  const formattedEta = useMemo(() => {
    if (!etaDate) return "";
    const currentYear = new Date().getFullYear();
    const etaYear = etaDate.getFullYear();
    const pattern = etaYear === currentYear ? "EEEE d MMMM" : "EEEE d MMMM yyyy";
    return format(etaDate, pattern, { locale: fr });
  }, [etaDate]);

  // Gestion du double clic sur le logo
  const handleLogoDoubleClick = useCallback(() => {
    setIsPixelated(true)
    setTimeout(() => setIsPixelated(false), 3000)
  }, [])

  // Gestion du bouton Early Access
  const handleSeedlingClick = useCallback(() => {
    if (data?.earlyAccess) {
      window.open("https://seedling.evodirecte.qzz.io", "_blank", "noopener,noreferrer");
    } else {
      setIsSeedlingDialogOpen(true)
    }
  }, [data?.earlyAccess])

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto p-6 font-sans">
      {/* Welcome Dialog */}
      <Dialog open={isWelcomeDialogOpen} onOpenChange={setIsWelcomeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              🫡 Adieu, evoMoyenne…
            </DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                Nous avons décidé d’abandonner evoMoyenne pour un tout nouveau projet nommé <strong><EvoDirecteWord>Scool</EvoDirecteWord></strong>.
              </p>
              <p>
                Rassurez-vous : <strong><EvoDirecteWord>Scool</EvoDirecteWord></strong> contiendra toutes les fonctionnalités d’evoMoyenne, et même plus ! Devoirs, absences, messages, emploi du temps, révisions intelligentes et bien plus. En fait, c’est comme le vrai EcoleDirecte… Mais en mieux !
              </p>
              <p>
                On vous laisse explorer cette page pour en savoir plus sur le futur de votre assistant scolaire.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" size="lg" onClick={() => setIsWelcomeDialogOpen(false)} className="w-full sm:w-auto">
              Super
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Seedling Access Dialog */}
      <Dialog open={isSeedlingDialogOpen} onOpenChange={setIsSeedlingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              🌱 Bientôt disponible !
            </DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                L'accès à <strong>Scool Seedling</strong> (la version bêta) n'est pas encore ouvert au public.
              </p>
              <p>
                Nous travaillons dur pour t'offrir la meilleure expérience possible. Reviens très bientôt pour tester les premières fonctionnalités en avant-première !
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" size="lg" onClick={() => setIsSeedlingDialogOpen(false)} className="w-full sm:w-auto">
              Compris
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HEADER */}
      <header className="flex justify-between items-center py-6">
        <button
          type="button"
          onDoubleClick={handleLogoDoubleClick}
          aria-label="Activer l’easter egg du logo Scool"
          className="bg-transparent border-none p-0 cursor-pointer"
        >
          <img 
            src="/logo.svg" 
            alt="Scool Logo" 
            className={`h-12 w-12 transition-all dark:invert ${isPixelated ? 'pixelated' : ''}`} 
          />
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
          rel="noopener noreferrer"
          aria-label="Ouvrir le dépôt GitHub dans un nouvel onglet"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">🏗️ <EvoDirecteWord>Scool</EvoDirecteWord> est en chantier.</h1>
          <h2 className="text-xl text-muted-foreground"><EvoDirecteWord>Scool</EvoDirecteWord>, c’est ton assistant scolaire indispensable.</h2>
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
        <ComparisonTable variants={sectionVariants} />

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="text-center space-y-4 py-12"
        >
          <h2 className="text-3xl font-bold">Tu veux tester <EvoDirecteWord>Scool</EvoDirecteWord> en avance ?</h2>
          <div className="flex flex-col items-center gap-2">
            <Button size="lg" onClick={handleSeedlingClick}>
              Ouvrir Scool Seedling
            </Button>
            <p className="text-sm text-muted-foreground/60">
              Teste Scool en avant-première et obtiens un badge spécial dans l’app finale
            </p>
          </div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <Footer variants={sectionVariants} />

      {/* Accessible live region for loading / progress text */}
      <div
        aria-live="polite"
        role="status"
        className="sr-only"
      >
        {progressText}
      </div>
    </div>
  )
}
