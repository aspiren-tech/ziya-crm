import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Shell from './components/layout/Shell';
import DashboardPage from './features/dashboard/DashboardPage';
import LeadsPage from './features/leads/LeadsPage';
import LeadDetailPage from './features/leads/LeadDetailPage';
import ContactsPage from './features/contacts/ContactsPage';
import AccountsPage from './features/accounts/AccountsPage';
import DealsPage from './features/deals/DealsPage';
import DealDetailPage from './features/deals/DealDetailPage';
import CampaignsPage from './features/campaigns/CampaignsPage';
import CampaignsAccountsPage from './features/campaigns/AccountsPage';
import CampaignsImportPage from './features/campaigns/ImportContactsPage';
import CampaignsCreatePage from './features/campaigns/CreateCampaignPage';
import CreateTemplatePage from './features/campaigns/CreateTemplatePage';
import WhatsAppTemplateBuilder from './features/templates/WhatsAppTemplateBuilder';
import CampaignDetailPage from './features/campaigns/CampaignDetailPage';
import ReportsPage from './features/reports/ReportsPage';
import SettingsPage from './features/settings/SettingsPage';
import AdsSyncPage from './features/adsSync/AdsSyncPage';
import InvoicesPage from './features/invoices/InvoicesPage';
import InvoiceDetailPage from './features/invoices/InvoiceDetailPage';
import CreateInvoicePage from './features/invoices/CreateInvoicePage';
import EditInvoicePage from './features/invoices/EditInvoicePage';
import AIAssistantPage from './features/ai/AIAssistantPage';
import ZiyaVoiceAssistant from './features/ai/ZiyaVoiceAssistant';
import TasksPage from './features/tasks/TasksPage';
import NotificationsPage from './features/notifications/NotificationsPage';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import { LeadsProvider } from './contexts/LeadsContext';
import { UIProvider } from './contexts/UIContext';
import { InvoicesProvider } from './contexts/InvoicesContext';
import { TimelineProvider } from './contexts/TimelineContext';
import { ContactsProvider } from './contexts/ContactsContext';
import { TasksProvider } from './contexts/TasksContext';
import { DealsProvider } from './contexts/DealsContext';
import { AccountsProvider } from './contexts/AccountsContext';
import { CampaignsProvider } from './contexts/CampaignsContext';
import { UsersProvider } from './contexts/UsersContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { MetaAccountProvider } from './contexts/MetaAccountContext';
import { CampaignModuleProvider } from './contexts/CampaignModuleContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ApiProvider } from './contexts/ApiContext';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <div className="bg-background text-text-main font-sans antialiased">
      <HashRouter>
        <ApiProvider>
          <AuthProvider>
            <UIProvider>
              <LeadsProvider>
                <InvoicesProvider>
                  <TimelineProvider>
                    <ContactsProvider>
                      <TasksProvider>
                        <DealsProvider>
                          <AccountsProvider>
                            <CampaignsProvider>
                              <UsersProvider>
                                <CompanyProvider>
                                  <MetaAccountProvider>
                                  <CampaignModuleProvider>
                                  <NotificationsProvider>
                                    <Routes>
                                      <Route path="/login" element={<LoginPage />} />
                                      <Route path="/signup" element={<SignupPage />} />
                                      <Route path="" element={<ProtectedRoute><Shell><Outlet /></Shell></ProtectedRoute>}>
                                        <Route index element={<DashboardPage />} />
                                        <Route path="leads" element={<LeadsPage />} />
                                        <Route path="leads/:id" element={<LeadDetailPage />} />
                                        <Route path="contacts" element={<ContactsPage />} />
                                        <Route path="tasks" element={<TasksPage />} />
                                        <Route path="accounts" element={<AccountsPage />} />
                                        <Route path="deals" element={<DealsPage />} />
                                        <Route path="deals/:id" element={<DealDetailPage />} />
                                        <Route path="campaigns" element={<CampaignsPage />} />
                                        <Route path="campaigns/:id" element={<CampaignDetailPage />} />
                                        <Route path="campaigns/accounts" element={<CampaignsAccountsPage />} />
                                        <Route path="campaigns/import" element={<CampaignsImportPage />} />
                                        <Route path="campaigns/create" element={<CampaignsCreatePage />} />
                                        <Route path="campaigns/templates/new" element={<CreateTemplatePage />} />
                                        <Route path="templates/whatsapp/new" element={<WhatsAppTemplateBuilder />} />
                                        <Route path="ads-sync" element={<AdsSyncPage />} />
                                        <Route path="invoices" element={<InvoicesPage />} />
                                        <Route path="invoices/new" element={<CreateInvoicePage />} />
                                        <Route path="invoices/:id" element={<InvoiceDetailPage />} />
                                        <Route path="invoices/:id/edit" element={<EditInvoicePage />} />
                                        <Route path="reports" element={<ReportsPage />} />
                                        <Route path="ai-assistant" element={<AIAssistantPage />} />
                                        <Route path="settings" element={<SettingsPage />} />
                                        <Route path="notifications" element={<NotificationsPage />} />
                                        <Route path="*" element={<DashboardPage />} />
                                      </Route>
                                    </Routes>
                                    <ZiyaVoiceAssistant />
                                  </NotificationsProvider>
                                  </CampaignModuleProvider>
                                  </MetaAccountProvider>
                                </CompanyProvider>
                              </UsersProvider>
                            </CampaignsProvider>
                          </AccountsProvider>
                        </DealsProvider>
                      </TasksProvider>
                    </ContactsProvider>
                  </TimelineProvider>
                </InvoicesProvider>
              </LeadsProvider>
            </UIProvider>
          </AuthProvider>
        </ApiProvider>
      </HashRouter>
    </div>
  );
};

export default App;