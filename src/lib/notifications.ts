import { getSupabaseClient } from '@/lib/supabase/api-client';

export type NotificationType = 
    | 'project_approved'
    | 'project_rejected'
    | 'milestone_approved'
    | 'milestone_rejected'
    | 'new_backer'
    | 'project_funded'
    | 'milestone_submitted'
    | 'project_update'
    | 'follow';

interface CreateNotificationParams {
    walletAddress: string;
    type: NotificationType;
    title: string;
    description: string;
    projectId?: string;
    actionUrl?: string;
    actionLabel?: string;
}

/**
 * Create a notification in the database
 */
export async function createNotification(params: CreateNotificationParams): Promise<boolean> {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
        console.warn('Supabase not available, skipping notification');
        return false;
    }

    try {
        const { error } = await supabase
            .from('notifications')
            .insert({
                wallet_address: params.walletAddress,
                type: params.type,
                title: params.title,
                description: params.description,
                project_id: params.projectId || null,
                action_url: params.actionUrl || null,
                action_label: params.actionLabel || null,
                read: false,
                created_at: new Date().toISOString(),
            });

        if (error) {
            console.error('Failed to create notification:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error creating notification:', error);
        return false;
    }
}

/**
 * Notify creator that their project was approved
 */
export async function notifyProjectApproved(
    creatorWallet: string,
    projectId: string,
    projectTitle: string
): Promise<void> {
    await createNotification({
        walletAddress: creatorWallet,
        type: 'project_approved',
        title: '🎉 Project Approved!',
        description: `Your project "${projectTitle}" has been approved and is now live!`,
        projectId,
        actionUrl: `/project/${projectId}`,
        actionLabel: 'View Project',
    });
}

/**
 * Notify creator that their project was rejected
 */
export async function notifyProjectRejected(
    creatorWallet: string,
    projectId: string,
    projectTitle: string,
    reason?: string
): Promise<void> {
    await createNotification({
        walletAddress: creatorWallet,
        type: 'project_rejected',
        title: 'Project Not Approved',
        description: reason 
            ? `Your project "${projectTitle}" was not approved. Reason: ${reason}`
            : `Your project "${projectTitle}" was not approved. Please review our guidelines and resubmit.`,
        projectId,
        actionUrl: `/dashboard/projects/${projectId}/edit`,
        actionLabel: 'Edit Project',
    });
}

/**
 * Notify creator that their milestone was approved and funds released
 */
export async function notifyMilestoneApproved(
    creatorWallet: string,
    projectId: string,
    projectTitle: string,
    milestoneTitle: string,
    amount?: number
): Promise<void> {
    const amountStr = amount ? ` $${(amount / 1_000_000).toFixed(2)} USDC` : '';
    await createNotification({
        walletAddress: creatorWallet,
        type: 'milestone_approved',
        title: '✅ Milestone Approved!',
        description: `Your milestone "${milestoneTitle}" for "${projectTitle}" has been approved.${amountStr ? ` ${amountStr} has been released to your wallet.` : ''}`,
        projectId,
        actionUrl: `/project/${projectId}`,
        actionLabel: 'View Project',
    });
}

/**
 * Notify creator that their milestone was rejected
 */
export async function notifyMilestoneRejected(
    creatorWallet: string,
    projectId: string,
    projectTitle: string,
    milestoneTitle: string,
    feedback?: string
): Promise<void> {
    await createNotification({
        walletAddress: creatorWallet,
        type: 'milestone_rejected',
        title: 'Milestone Needs Revision',
        description: feedback
            ? `Your milestone "${milestoneTitle}" for "${projectTitle}" needs revision. Feedback: ${feedback}`
            : `Your milestone "${milestoneTitle}" for "${projectTitle}" needs revision. Please update your proof and resubmit.`,
        projectId,
        actionUrl: `/dashboard/creator/milestones`,
        actionLabel: 'View Milestones',
    });
}

/**
 * Notify creator of a new backer
 */
export async function notifyNewBacker(
    creatorWallet: string,
    projectId: string,
    projectTitle: string,
    backerAddress: string
): Promise<void> {
    const shortAddress = `${backerAddress.slice(0, 4)}...${backerAddress.slice(-4)}`;
    await createNotification({
        walletAddress: creatorWallet,
        type: 'new_backer',
        title: '🙌 New Backer!',
        description: `${shortAddress} just backed your project "${projectTitle}"!`,
        projectId,
        actionUrl: `/project/${projectId}`,
        actionLabel: 'View Project',
    });
}

/**
 * Notify creator that their project reached its funding goal
 */
export async function notifyProjectFunded(
    creatorWallet: string,
    projectId: string,
    projectTitle: string,
    totalRaised: number
): Promise<void> {
    const amountStr = `$${(totalRaised / 1_000_000).toFixed(2)}`;
    await createNotification({
        walletAddress: creatorWallet,
        type: 'project_funded',
        title: '🎊 Goal Reached!',
        description: `Congratulations! Your project "${projectTitle}" has reached its funding goal of ${amountStr}!`,
        projectId,
        actionUrl: `/project/${projectId}`,
        actionLabel: 'View Project',
    });
}

/**
 * Notify admin of new milestone submission
 */
export async function notifyMilestoneSubmitted(
    adminWallet: string,
    projectId: string,
    projectTitle: string,
    milestoneTitle: string,
    creatorWallet: string
): Promise<void> {
    const shortAddress = `${creatorWallet.slice(0, 4)}...${creatorWallet.slice(-4)}`;
    await createNotification({
        walletAddress: adminWallet,
        type: 'milestone_submitted',
        title: '📋 Milestone Review Needed',
        description: `${shortAddress} submitted "${milestoneTitle}" for review on "${projectTitle}"`,
        projectId,
        actionUrl: `/admin`,
        actionLabel: 'Review',
    });
}

/**
 * Notify backers of a project update
 */
export async function notifyProjectUpdate(
    backerWallets: string[],
    projectId: string,
    projectTitle: string,
    updateTitle: string
): Promise<void> {
    const notifications = backerWallets.map(wallet => ({
        wallet_address: wallet,
        type: 'project_update' as const,
        title: '📢 Project Update',
        description: `New update on "${projectTitle}": ${updateTitle}`,
        project_id: projectId,
        action_url: `/project/${projectId}`,
        action_label: 'Read Update',
        read: false,
        created_at: new Date().toISOString(),
    }));

    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Batch insert notifications
    const batchSize = 100;
    for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        await supabase.from('notifications').insert(batch);
    }
}
