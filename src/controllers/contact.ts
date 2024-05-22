import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

const bodySchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
});

async function handleRequest(req: Request, res: Response) {
  const { success } = bodySchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid request body",
      message: "Bad request please check the inputs",
    });
  }
  const { email, phoneNumber } = req.body;

  // Find existing contacts
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: { equals: email } },
        { phoneNumber: { equals: phoneNumber } },
      ],
    },
  });

  let primaryContact: any = null;

  if (existingContacts.length === 0) {
    // No existing contacts, create a new primary contact
    primaryContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber: phoneNumber,
        linkPrecedence: "primary",
      },
    });
  } else {
    // Determine primary contact
    primaryContact = existingContacts.find(
      (contact: any) => contact.linkPrecedence === "primary"
    );

    if (!primaryContact) {
      // No primary contact, make the first one primary
      primaryContact = existingContacts[0];
      await prisma.contact.update({
        where: { id: primaryContact.id },
        data: { linkPrecedence: "primary" },
      });
    }

    // Check if there's a need to create a secondary contact
    const secondaryContacts = existingContacts.filter(
      (contact: any) => contact.id !== primaryContact.id
    );
    const isPhoneMatched = secondaryContacts.some(
      (contact: any) => contact.phoneNumber === phoneNumber
    );
    const isEmailMatched = secondaryContacts.some(
      (contact: any) => contact.email === email
    );

    if (!isPhoneMatched || !isEmailMatched) {
      // Create a new secondary contact if not both matched
      await prisma.contact.create({
        data: {
          email,
          phoneNumber: phoneNumber,
          linkPrecedence: "secondary",
          linkedId: primaryContact.id,
        },
      });
    } else {
      // Update the newer contact to secondary
      const newerContact = secondaryContacts.sort((a: any, b: any) =>
        a.createdAt > b.createdAt ? -1 : 1
      )[0];
      await prisma.contact.update({
        where: { id: newerContact.id },
        data: {
          linkPrecedence: "secondary",
          linkedId: primaryContact.id,
        },
      });
    }
  }

  // Prepare the response
  const allLinkedContacts = await prisma.contact.findMany({
    where: {
      OR: [{ id: primaryContact.id }, { linkedId: primaryContact.id }],
    },
  });

  const primaryContactId = primaryContact.id;
  const emails = Array.from(
    new Set(
      allLinkedContacts.map((contact: any) => contact.email).filter(Boolean)
    )
  );
  const phoneNumbers = Array.from(
    new Set(
      allLinkedContacts
        .map((contact: any) => contact.phoneNumber)
        .filter(Boolean)
    )
  );
  const secondaryContactIds = allLinkedContacts
    .filter((contact: any) => contact.linkPrecedence === "secondary")
    .map((contact: any) => contact.id);

  return res.json({
    contact: {
      primaryContactId,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  });
}

export default handleRequest;
