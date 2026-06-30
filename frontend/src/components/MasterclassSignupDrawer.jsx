import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { CheckCircle2, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AUDIENCE_OPTIONS } from '@/lib/courses';
import { createLead } from '@/lib/api';
import { MASTERCLASS } from '@/constants/testIds';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{5,18}$/;

export const MasterclassSignupDrawer = ({ open, onOpenChange, source = 'home_masterclass' }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        audience_type: 'professional',
        interest: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const update = (k, v) => {
        setForm((f) => ({ ...f, [k]: v }));
        if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Please tell us your name';
        if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email';
        if (!PHONE_RE.test(form.phone)) e.phone = 'Enter a valid WhatsApp number';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            await createLead({ ...form, source });
            setSuccess(true);
            toast.success('You\u2019re in! Check WhatsApp for joining link.');
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenChange = (next) => {
        onOpenChange(next);
        if (!next) {
            setTimeout(() => {
                setSuccess(false);
                setErrors({});
            }, 250);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                data-testid={MASTERCLASS.drawer}
                className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
                <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#FFF7EE] to-white">
                    <DialogHeader className="text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00]/10 text-[#9A3412] px-3 py-1 text-xs font-medium w-max">
                            <Sparkles className="w-3.5 h-3.5" />
                            Free live masterclass
                        </div>
                        <DialogTitle className="font-display text-2xl sm:text-3xl mt-3 text-slate-900">
                            AI Chatbots — the must-knows.
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                            For students, professionals, business owners & parents. Walk away with templates and
                            resources worth <span className="font-semibold text-slate-900">₹50,000</span>.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="px-6 pb-6">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                data-testid={MASTERCLASS.successState}
                                className="py-8 text-center"
                            >
                                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                                </div>
                                <h3 className="font-display text-xl font-semibold text-slate-900">{'You\u2019re in!'}</h3>
                                <p className="text-slate-600 mt-2">
                                    {'We\u2019ll WhatsApp you the joining link + \u20b950k resources before the live class.'}
                                </p>
                                <Button
                                    onClick={() => handleOpenChange(false)}
                                    className="mt-5 bg-[#0B0F14] hover:bg-black text-white rounded-xl"
                                >
                                    Close
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                onSubmit={onSubmit}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="space-y-4 pt-4"
                                noValidate
                            >
                                <div>
                                    <Label htmlFor="mc-name">Full name</Label>
                                    <Input
                                        id="mc-name"
                                        data-testid={MASTERCLASS.nameInput}
                                        value={form.name}
                                        onChange={(e) => update('name', e.target.value)}
                                        placeholder="Aarav Sharma"
                                        className="mt-1 h-12 rounded-xl"
                                        autoComplete="name"
                                    />
                                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="mc-email">Email</Label>
                                        <Input
                                            id="mc-email"
                                            data-testid={MASTERCLASS.emailInput}
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => update('email', e.target.value)}
                                            placeholder="you@email.com"
                                            className="mt-1 h-12 rounded-xl"
                                            autoComplete="email"
                                        />
                                        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="mc-phone">WhatsApp number</Label>
                                        <Input
                                            id="mc-phone"
                                            data-testid={MASTERCLASS.phoneInput}
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => update('phone', e.target.value)}
                                            placeholder="+91 99999 99999"
                                            className="mt-1 h-12 rounded-xl"
                                            autoComplete="tel"
                                        />
                                        {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div>
                                    <Label>You are a…</Label>
                                    <div
                                        data-testid={MASTERCLASS.audienceSelect}
                                        className="mt-2 grid grid-cols-2 gap-2"
                                    >
                                        {AUDIENCE_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => update('audience_type', opt.value)}
                                                className={`text-left rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                                                    form.audience_type === opt.value
                                                        ? 'border-[#FF6A00] bg-[#FFF7EE] text-[#0B0F14]'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span className="block font-medium">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="mc-interest">What do you want AI to help with?</Label>
                                    <Textarea
                                        id="mc-interest"
                                        data-testid={MASTERCLASS.interestInput}
                                        value={form.interest}
                                        onChange={(e) => update('interest', e.target.value)}
                                        rows={3}
                                        placeholder="e.g. save time on Instagram, write SEO blogs faster, grow my D2C brand"
                                        className="mt-1 rounded-xl"
                                    />
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    No spam. WhatsApp reminders only. Unsubscribe anytime.
                                </div>

                                <Button
                                    type="submit"
                                    data-testid={MASTERCLASS.submitButton}
                                    disabled={submitting}
                                    className="w-full h-12 bg-[#FF6A00] hover:bg-[#E85F00] active:bg-[#D45500] text-white rounded-xl text-base font-semibold shadow-[0_10px_24px_rgba(255,106,0,0.25)]"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Reserving your seat…
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Reserve my free seat
                                        </>
                                    )}
                                </Button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MasterclassSignupDrawer;
