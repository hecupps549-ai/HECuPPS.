"use client";

import React, { useState, useEffect } from 'react';
import { Card, Input, Textarea, Button, Select } from '@/components/UI';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [siteSettings, setSiteSettings] = useState({
        id: 1,
        siteName: 'HECuPPS',
        logoUrl: '',
        footerText: '',
        contactEmail: '',
        contactPhone: '',
        instagramUrl: '',
        currency: 'INR',
        taxRate: 0,
        maintenanceMode: false,
        allowSignups: true,
    });

    const [paymentSettings, setPaymentSettings] = useState({
        id: 1,
        razorpayEnabled: false,
        razorpayKeyId: '',
        razorpayKeySecret: '',
        stripeEnabled: false,
        stripePublishKey: '',
        stripeSecretKey: '',
        paypalEnabled: false,
        paypalClientId: '',
        paypalSecret: '',
        interacEnabled: false,
        interacEmail: '',
        interacInstructions: '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();

            if (data.siteSettings) {
                setSiteSettings(prev => ({ ...prev, ...data.siteSettings }));
            }
            if (data.paymentSettings) {
                setPaymentSettings(prev => ({ ...prev, ...data.paymentSettings }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteSettings,
                    paymentSettings,
                }),
            });

            if (response.ok) {
                alert('Settings saved successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                        Settings
                    </h1>
                </div>
                <Card className="p-12">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        Loading settings...
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Configure your store settings, contact information, and payment gateways
                </p>
            </div>

            <div className="space-y-6">
                {/* General Settings */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        General Settings
                    </h2>
                    <div className="space-y-4 max-w-2xl">
                        <Input
                            label="Site Name"
                            value={siteSettings.siteName || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                        />
                        <Input
                            label="Logo URL (Optional)"
                            value={siteSettings.logoUrl || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, logoUrl: e.target.value })}
                            placeholder="https://example.com/logo.png"
                        />
                        <Textarea
                            label="Footer Text (Optional)"
                            value={siteSettings.footerText || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })}
                            rows={2}
                            placeholder="Custom footer text..."
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Primary Currency"
                                value={siteSettings.currency}
                                onChange={(e) => setSiteSettings({ ...siteSettings, currency: e.target.value })}
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="CAD">CAD ($)</option>
                            </Select>
                            <Input
                                label="Tax Rate (%)"
                                type="number"
                                step="0.01"
                                value={siteSettings.taxRate}
                                onChange={(e) => setSiteSettings({ ...siteSettings, taxRate: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                </Card>

                {/* Contact Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Contact Information
                    </h2>
                    <div className="space-y-4 max-w-2xl">
                        <Input
                            label="Contact Email"
                            type="email"
                            value={siteSettings.contactEmail || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                            placeholder="contact@hecupps.com"
                        />
                        <Input
                            label="Contact Phone"
                            type="tel"
                            value={siteSettings.contactPhone || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                        />
                        <Input
                            label="Instagram URL"
                            value={siteSettings.instagramUrl || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                            placeholder="https://instagram.com/hecupps"
                        />
                    </div>
                </Card>

                {/* Feature Toggles */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Feature Toggles
                    </h2>
                    <div className="space-y-4 max-w-2xl">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={siteSettings.maintenanceMode}
                                onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMode: e.target.checked })}
                                className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold"
                            />
                            <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Mode</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Display maintenance message to visitors</p>
                            </div>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={siteSettings.allowSignups}
                                onChange={(e) => setSiteSettings({ ...siteSettings, allowSignups: e.target.checked })}
                                className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold"
                            />
                            <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow User Signups</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Enable new user registration</p>
                            </div>
                        </label>
                    </div>
                </Card>

                {/* Payment Gateways */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Payment Gateways
                    </h2>
                    <div className="space-y-6">
                        {/* Razorpay */}
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Razorpay (INR)</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">For Indian customers</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={paymentSettings.razorpayEnabled}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayEnabled: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-gold/20 dark:peer-focus:ring-brand-gold/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-gold"></div>
                                </label>
                            </div>
                            {paymentSettings.razorpayEnabled && (
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Razorpay Key ID"
                                        value={paymentSettings.razorpayKeyId || ''}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Razorpay Secret Key"
                                        type="password"
                                        value={paymentSettings.razorpayKeySecret || ''}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeySecret: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Stripe */}
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Stripe (CAD)</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">For Canadian customers</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={paymentSettings.stripeEnabled}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeEnabled: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-gold/20 dark:peer-focus:ring-brand-gold/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-gold"></div>
                                </label>
                            </div>
                            {paymentSettings.stripeEnabled && (
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Stripe Publishable Key"
                                        value={paymentSettings.stripePublishKey || ''}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripePublishKey: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Stripe Secret Key"
                                        type="password"
                                        value={paymentSettings.stripeSecretKey || ''}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeSecretKey: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* PayPal */}
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">PayPal</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">International payments</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={paymentSettings.paypalEnabled}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalEnabled: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-gold/20 dark:peer-focus:ring-brand-gold/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-gold"></div>
                                </label>
                            </div>
                            {paymentSettings.paypalEnabled && (
                                <div className="space-y-3">
                                    <Input
                                        placeholder="PayPal Client ID"
                                        value={paymentSettings.paypalClientId || ''}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalClientId: e.target.value })}
                                    />
                                    <Input
                                        placeholder="PayPal Secret"
                                        type="password"
                                        value={paymentSettings.paypalSecret || ''}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalSecret: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Interac */}
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Interac e-Transfer (Manual)</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Manual payment processing for Canadian customers</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={paymentSettings.interacEnabled}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, interacEnabled: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-gold/20 dark:peer-focus:ring-brand-gold/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-gold"></div>
                                </label>
                            </div>
                            {paymentSettings.interacEnabled && (
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Interac Email"
                                        type="email"
                                        value={paymentSettings.interacEmail || ''}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, interacEmail: e.target.value })}
                                    />
                                    <Textarea
                                        placeholder="Instructions for customers (e.g., security question, message)"
                                        rows={3}
                                        value={paymentSettings.interacInstructions || ''}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, interacInstructions: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Reset
                    </button>
                    <Button onClick={handleSave} className="px-8" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
