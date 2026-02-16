import React, { useState, useEffect } from 'react';
import ContactList from '../components/ContactList';
import ContactForm from '../components/ContactForm';
import { contactsApi } from '../services/api';
import type { Contact, ContactCreate, ContactUpdate } from '../types';

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await contactsApi.getAll();
      setContacts(data);
    } catch (err) {
      setError('Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (newContact: ContactCreate | ContactUpdate) => {
    try {
      const created = await contactsApi.create(newContact as ContactCreate);
      setContacts([...contacts, created]);
      setIsAdding(false);
    } catch (err) {
      console.error('Error creating contact:', err);
      alert('Failed to create contact');
    }
  };

  const handleEditContact = async (updatedContact: ContactCreate | ContactUpdate) => {
    if (!editingContact) return;
    
    try {
      const updated = await contactsApi.update(editingContact.id, updatedContact as ContactUpdate);
      setContacts(contacts.map(c => c.id === editingContact.id ? updated : c));
      setEditingContact(null);
    } catch (err) {
      console.error('Error updating contact:', err);
      alert('Failed to update contact');
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    
    try {
      await contactsApi.delete(id);
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Failed to delete contact');
    }
  };

  const startEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsAdding(false);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={loadContacts}
            className="ml-4 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Contacts</h1>
        {!isAdding && !editingContact && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Contact
          </button>
        )}
      </div>

      {(isAdding || editingContact) ? (
        <div className="mb-6">
          <ContactForm
            initialData={editingContact}
            onSubmit={editingContact ? handleEditContact : handleAddContact}
            onCancel={() => {
              setIsAdding(false);
              setEditingContact(null);
            }}
          />
        </div>
      ) : (
        <ContactList
          contacts={contacts}
          onEdit={startEdit}
          onDelete={handleDeleteContact}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ContactsPage;
