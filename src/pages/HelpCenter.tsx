import { useState } from "react";
import { Send, Mail, MessageCircle } from "lucide-react";

const team = [
  { name: "Jerémie Konda", role: "Full-Stack Engineer", image: "/images/team-jeremie.png" },
  { name: "Arun Kuganesan", role: "Frontend Engineer", image: "/images/team-arun.jpg" },
  { name: "Adel Noui", role: "Backend Engineer", image: "/images/team-adel.jpg" },
  { name: "Gaïa Mezaïb", role: "Product & Design", image: "/images/team-gaia.png" },
];

const faqs = [
  {
    q: "How does Mater recommend materials?",
    a: "Mater uses a multi-criteria scoring engine that weighs sustainability, cost, carbon efficiency, and mechanical properties based on your chosen optimization profile.",
  },
  {
    q: "Can I export my audit results?",
    a: "Yes, you can export your material audit reports as PDF or CSV from the Dashboard page.",
  },
  {
    q: "What fields are supported?",
    a: "Mater currently supports Medicine, Architecture, Mechanics, and Aerospace, with more fields coming soon.",
  },
  {
    q: "Is my data private?",
    a: "Absolutely. All your audit data and chat history are stored locally and never shared with third parties.",
  },
];

const HelpCenter = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-serif text-4xl text-foreground mb-3">Help Center</h1>
        <p className="text-muted-foreground text-lg">
          Everything you need to get started and get help.
        </p>
      </div>

      {/* FAQ */}
      <section>
        <h2 className="font-serif text-2xl text-foreground mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-medium text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="font-serif text-2xl text-foreground mb-8 text-center">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <div className="w-36 h-44 rounded-xl overflow-hidden border border-border bg-card shadow-sm mb-3">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-medium text-foreground text-sm">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section>
        <h2 className="font-serif text-2xl text-foreground mb-2 text-center">Report a Problem</h2>
        <p className="text-muted-foreground text-center mb-8">
          Something not working? Let us know and we'll get back to you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Describe the issue you're experiencing..."
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Message
          </button>
          {sent && (
            <p className="text-center text-sm text-primary">
              Message sent! We'll get back to you soon.
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default HelpCenter;
