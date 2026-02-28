import { db } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
    let logs: any[] = [];
    try {
        const result = await db.execute('SELECT * FROM webhooks ORDER BY created_at DESC LIMIT 50');
        logs = result.rows;
    } catch (error) {
        console.error('Error fetching logs:', error);
    }

    return (
        <main className="flex min-h-screen flex-col p-8 bg-slate-900 text-white font-sans">
            <div className="max-w-6xl mx-auto w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        Webhook Event Logs
                    </h1>
                    <Link href="/" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                        Back to Home
                    </Link>
                </div>

                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Time</th>
                                <th className="p-4 font-semibold">Event Type</th>
                                <th className="p-4 font-semibold">Razorpay ID</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-500 italic">
                                        No webhooks received yet. Send a test from Razorpay Dashboard!
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => {
                                    const payload = JSON.parse(log.payload);
                                    const razorpayId = payload.payload?.payment?.entity?.id || 'N/A';
                                    return (
                                        <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="p-4 text-slate-300 text-sm">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={"px-2 py-1 rounded text-xs font-medium border " + (log.event.includes('captured') ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                                                        log.event.includes('failed') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    )}>
                                                    {log.event}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-400 font-mono text-xs">
                                                {razorpayId}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
