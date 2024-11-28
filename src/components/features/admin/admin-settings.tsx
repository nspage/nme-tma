import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const generalSettingsSchema = z.object({
  platformName: z.string().min(2).max(50),
  description: z.string().max(500),
  contactEmail: z.string().email(),
  minProposalThreshold: z.string(),
  quorumThreshold: z.string(),
  votingPeriod: z.string(),
  enablePublicProposals: z.boolean(),
})

const securitySettingsSchema = z.object({
  adminWallet: z.string(),
  treasuryWallet: z.string(),
  minStakeAmount: z.string(),
  enableWhitelist: z.boolean(),
  whitelistedAddresses: z.string(),
})

export function AdminSettings() {
  const [isPending, setIsPending] = useState(false)

  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      platformName: "TON Governance",
      description: "A decentralized governance platform for the TON ecosystem",
      contactEmail: "admin@tongovernance.org",
      minProposalThreshold: "1000",
      quorumThreshold: "10",
      votingPeriod: "7",
      enablePublicProposals: true,
    },
  })

  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      adminWallet: "0x1234...5678",
      treasuryWallet: "0x9876...5432",
      minStakeAmount: "100",
      enableWhitelist: false,
      whitelistedAddresses: "",
    },
  })

  async function onSubmitGeneral(values: z.infer<typeof generalSettingsSchema>) {
    setIsPending(true)
    
    try {
      // Implement settings update logic here
      console.log("Updating general settings:", values)
      
      toast({
        title: "Settings Updated",
        description: "General settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  async function onSubmitSecurity(values: z.infer<typeof securitySettingsSchema>) {
    setIsPending(true)
    
    try {
      // Implement security settings update logic here
      console.log("Updating security settings:", values)
      
      toast({
        title: "Settings Updated",
        description: "Security settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your platform settings and configurations.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings and parameters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-8">
                  <FormField
                    control={generalForm.control}
                    name="platformName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your governance platform.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          A brief description of your platform.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          Primary contact email for platform administration.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={generalForm.control}
                      name="minProposalThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Proposal Threshold</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" />
                          </FormControl>
                          <FormDescription>
                            Minimum TON required to create a proposal.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="quorumThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quorum Threshold (%)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" max="100" />
                          </FormControl>
                          <FormDescription>
                            Minimum participation required.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="votingPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voting Period (days)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" />
                          </FormControl>
                          <FormDescription>
                            Duration of voting period.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="enablePublicProposals"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Public Proposals
                          </FormLabel>
                          <FormDescription>
                            Allow any eligible user to create proposals.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isPending}>
                    Save General Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and access control settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-8">
                  <FormField
                    control={securityForm.control}
                    name="adminWallet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Wallet Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The wallet address with administrative privileges.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="treasuryWallet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treasury Wallet Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The wallet address for the platform treasury.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="minStakeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stake Amount</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" />
                        </FormControl>
                        <FormDescription>
                          Minimum TON required to participate in governance.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="enableWhitelist"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Whitelist
                          </FormLabel>
                          <FormDescription>
                            Restrict participation to whitelisted addresses only.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="whitelistedAddresses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Whitelisted Addresses</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter wallet addresses, one per line.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isPending}>
                    Save Security Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
