import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import NewsletterSection from '@/components/NewsletterSection'

export default function CookiesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative -bottom-20">
        <div className="bg-coral h-[25vh] flex items-center rounded-b-3xl relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-none">
              <div>ΠΟΛΙΤΙΚΗ</div>
              <div>COOKIES</div>
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-3xl font-bold mb-8 text-charcoal">ΠΟΛΙΤΙΚΗ COOKIE</h2>

            <h3 className="text-2xl font-bold mb-4 mt-12 text-charcoal">Αυτός ο ιστότοπος χρησιμοποιεί cookies</h3>

            <p className="mb-6 leading-relaxed">
              Χρησιμοποιούμε cookies για την εξατομίκευση του περιεχομένου και των διαφημίσεων, την παροχή λειτουργιών κοινωνικών δικτύων και την ανάλυση σκοπιμότητάς μας. Επιπλέον, μοιραζόμαστε πληροφορίες σχετικά με τον τρόπο που χρησιμοποιείτε τον ιστότοπό μας με συνεργάτες κοινωνικής δικτύωσης, διαφήμισης και ανάλυσης, οι οποίοι ενδέχεται να τις συνδυάσουν με άλλες πληροφορίες που τους έχετε παράσχει ή που έχουν συλλέξει σε σχέση με τη χρήση των υπηρεσιών τους από εσάς. Τα μη απαραίτητα (μη λειτουργικά) cookies είναι απενεργοποιημένα από προεπιλογή.
            </p>

            <p className="mb-6 leading-relaxed">
              Ο νόμος προβλέπει ότι μπορούμε να αποθηκεύουμε cookies στη συσκευή σας, εφόσον είναι απολύτως απαραίτητα για τη λειτουργία αυτού του ιστότοπου (λειτουργικά cookies). Για όλους τους άλλους τύπους cookies χρειαζόμαστε τη συγκατάθεσή σας.
            </p>

            <p className="mb-6 leading-relaxed">
              Το Culture For Change εφαρμόζει αυστηρή πολιτική για την προστασία της ιδιωτικής ζωής των επισκεπτών του ιστοτόπου του. Με την παρούσα ανακοίνωση σας παρέχουμε περισσότερες πληροφορίες σχετικά με τον τρόπο που χρησιμοποιούμε τα cookies κάθε φορά που επισκέπτεστε τον ιστότοπό μας.
            </p>

            <p className="mb-12 leading-relaxed">
              Μπορείτε να διαχειριστείτε τα cookies, να τα ενεργοποιήσετε ή να ανακαλέσετε τη συγκατάθεσή σας ανά πάσα στιγμή μέσω του πεδίου Ρυθμίσεις cookies στον ιστότοπό μας.
            </p>

            <h3 className="text-2xl font-bold mb-4 mt-12 text-charcoal">Ποια είναι η έννοια των cookies</h3>

            <p className="mb-6 leading-relaxed">
              Τα cookies είναι μικρά αρχεία που αποστέλλονται στο πρόγραμμα περιήγησής σας από τον ιστότοπο που επισκέπτεστε. Βοηθούν τον ιστότοπο να θυμάται πληροφορίες σχετικά με την επίσκεψή σας, όπως η προτιμώμενη γλώσσα και άλλες ρυθμίσεις. Με τον τρόπο αυτό, μπορεί να διευκολύνει την επόμενη επίσκεψή σας και να βελτιώσει τη χρησιμότητα αυτού του ιστότοπου για εσάς. Τα cookies παίζουν σημαντικό ρόλο. Χωρίς αυτά, η χρήση του διαδικτύου θα ήταν μια πολύ πιο περίπλοκη εμπειρία.
            </p>

            <p className="mb-12 leading-relaxed">
              Χρησιμοποιούμε cookies για πολλούς λόγους. Για παράδειγμα, για να θυμόμαστε τις προτιμήσεις ασφαλούς αναζήτησης ή για να υπολογίζουμε τον αριθμό των επισκεπτών σε μια σελίδα.
            </p>

            <h3 className="text-2xl font-bold mb-4 mt-12 text-charcoal">Κάνουμε χρήση Cookies,</h3>

            <p className="mb-6 leading-relaxed">
              Ναι, χρησιμοποιούμε ορισμένα cookies με κύριο σκοπό να καταστήσουμε τον ιστότοπό μας πιο λειτουργικό και φιλικό προς τον χρήστη.
            </p>

            <p className="mb-12 leading-relaxed">
              Ο ιστότοπος διαθέτει απαραίτητα (λειτουργικά ή απαραίτητα) cookies, και ειδικότερα, cookies συνεδρίας ή μόνιμα cookies, ιδιόκτητα ή τρίτου μέρους, που υπάρχουν για την περιγραφή στους ιστότοπους, για την εσωτερική ασφάλεια και το σύστημα.
            </p>

            <p className="mb-12 leading-relaxed">
              Για σκοπούς διαχείρισης. Τα απαραίτητα cookies είναι υποχρεωτικά και προεπιλέγονται κατά τη σύνδεσή σας στους ιστότοπους.
            </p>

            <h3 className="text-2xl font-bold mb-4 mt-12 text-charcoal">Πώς να ελέγξετε και να διαγράψετε τα cookies</h3>

            <p className="mb-6 leading-relaxed">
              Ο ιστότοπός μας παρέχει έναν μηχανισμό για να συναινέσετε/επιλέξετε και να διαχειριστείτε τις προτιμήσεις σας σχετικά με την αποθήκευση των cookies (Ρυθμίσεις cookie).
            </p>

            <p className="mb-6 leading-relaxed">
              Ωστόσο, εκτός από τον μηχανισμό επεξεργασίας των cookies μέσω αυτού του ιστότοπου, μπορείτε να αλλάξετε τις ρυθμίσεις του προγράμματος περιήγησης ή της κινητής συσκευής σας προκειμένου να αποτρέψετε την εγκατάσταση cookies στον υπολογιστή ή την κινητή συσκευή σας ή να τα διαγράφετε κάθε φορά που ολοκληρώνετε την πλοήγηση. Εάν επισκεφθείτε τη σελίδα "βοήθεια" του προγράμματος περιήγησής σας, θα μπορέσετε να λάβετε οδηγίες σχετικά με τον τρόπο διαχείρισης των ρυθμίσεων των cookies. Εάν επιλέξετε να αποτρέψετε την εγκατάσταση των cookies, όπως αναφέρθηκε παραπάνω, ενδέχεται να μην μπορείτε να χρησιμοποιήσετε λειτουργίες του ιστότοπου, των εφαρμογών και των υπηρεσιών μας.
            </p>

            <p className="mb-12 leading-relaxed">
              Για περισσότερες πληροφορίες σχετικά με τα cookies μπορείτε να επισκεφθείτε τις ιστοσελίδες www.allaboutcookies.org και www.youronlinechoices.eu.
            </p>

            <h3 className="text-2xl font-bold mb-4 mt-12 text-charcoal">Απολύτως Απαραίτητα Cookies</h3>
            <p className="mb-12 leading-relaxed text-gray-500 italic">
              Περιεχόμενο θα προστεθεί σύντομα...
            </p>

            <h3 className="text-2xl font-bold mb-4 mt-12 text-charcoal">Στατιστικά Cookies</h3>
            <p className="mb-12 leading-relaxed text-gray-500 italic">
              Περιεχόμενο θα προστεθεί σύντομα...
            </p>
          </div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
      <CookieConsent />
    </main>
  )
}
