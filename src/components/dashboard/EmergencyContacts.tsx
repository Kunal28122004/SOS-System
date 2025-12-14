import { getContacts, addContact, removeContact } from "@/lib/actions";
import { Users, Trash2, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { SubmitButton } from "../ui/submit-button";

export default async function EmergencyContacts() {
  const contacts = await getContacts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Emergency Contacts</span>
        </CardTitle>
        <CardDescription>
          People to notify when you trigger an SOS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={addContact} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Contact Name</Label>
            <Input id="name" name="name" placeholder="e.g., Mom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneOrEmail">Phone or Email</Label>
            <Input
              id="phoneOrEmail"
              name="phoneOrEmail"
              placeholder="Contact's phone or email"
              required
            />
          </div>
          <SubmitButton className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </SubmitButton>
        </form>

        <div className="mt-6 space-y-2">
            <h4 className="font-medium">Saved Contacts</h4>
          {contacts.length > 0 ? (
            <ul className="space-y-2">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.phoneOrEmail}
                    </p>
                  </div>
                  <form action={removeContact.bind(null, contact.id)}>
                    <Button variant="ghost" size="icon" type="submit">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove contact</span>
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No contacts added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
