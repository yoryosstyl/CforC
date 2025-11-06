# Strapi CMS Setup Guide for Culture for Change

This guide will walk you through setting up Strapi CMS for easy content management.

## 🚀 Part 1: Install Strapi (5 minutes)

### Step 1: Create Strapi Project

Open your terminal on your Mac:

```bash
cd "/Users/yoryosstyl/Documents/Projects/Projects (active)/CforC/Website"

# Create Strapi project
npx create-strapi-app@latest cms --quickstart
```

**During installation:**
- "Participate in A/B testing?" → Type `n` and press Enter
- Wait 2-3 minutes for installation
- When done, it will automatically open `http://localhost:1337/admin`

### Step 2: Create Admin Account

When the browser opens:
1. Fill in your admin details:
   - **First name:** Your name
   - **Last name:** Your last name
   - **Email:** your-email@example.com
   - **Password:** Create a strong password
2. Click "Let's start"

**✅ You now have Strapi running!**

---

## 📝 Part 2: Create Content Types (10 minutes)

### Content Type 1: Open Calls

1. In the Strapi admin, click **Content-Type Builder** (left sidebar)
2. Click **"Create new collection type"**
3. **Display name:** `Open Call`
4. Click **Continue**

**Add these fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| title | Text | Required |
| deadline | Date | Required |
| description | Rich text | Required |
| priority | Boolean | Default: false |
| link | Text | |
| image | Media (Single) | |

5. Click **Save**
6. Click **Finish**

---

### Content Type 2: Members

1. Click **"Create new collection type"** again
2. **Display name:** `Member`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| name | Text | Required |
| photo | Media (Single) | Required |
| bio | Rich text | |
| role | Text | |
| location | Text | |
| email | Email | |

4. Click **Save**
5. Click **Finish**

---

### Content Type 3: Activities

1. Click **"Create new collection type"** again
2. **Display name:** `Activity`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Settings |
|------------|------|----------|
| title | Text | Required |
| date | Date | Required |
| description | Rich text | Required |
| organization | Text | Default: "CULTURE FOR CHANGE" |
| image | Media (Single) | |
| type | Enumeration | Values: workshop, event, program |
| featured | Boolean | Default: false |

4. Click **Save**
5. Click **Finish**

---

## 🔓 Part 3: Configure API Permissions (2 minutes)

**Allow public access to content:**

1. Click **Settings** (left sidebar)
2. Click **Roles** under Users & Permissions Plugin
3. Click **Public**
4. Check these permissions:
   - ✅ **Open-call:** find, findOne
   - ✅ **Member:** find, findOne
   - ✅ **Activity:** find, findOne
5. Click **Save**

---

## ✅ Part 4: Test by Adding Sample Content (5 minutes)

### Add a Sample Open Call:

1. Click **Content Manager** (left sidebar)
2. Click **Open Call**
3. Click **Create new entry**
4. Fill in:
   - **Title:** "European Festivals Fund 2025"
   - **Deadline:** 03/11/2025
   - **Description:** "Funding opportunity for emerging artists..."
   - **Priority:** ✅ (check)
   - **Link:** "https://example.com"
5. Click **Save**
6. Click **Publish**

### Add a Sample Member:

1. Click **Member**
2. Click **Create new entry**
3. Fill in:
   - **Name:** "John Doe"
   - **Photo:** Upload an image
   - **Bio:** "Artist and cultural innovator..."
   - **Role:** "Member"
   - **Location:** "Athens"
4. Click **Save**
5. Click **Publish**

---

## 🧪 Part 5: Test the API (1 minute)

Open your browser and visit:

```
http://localhost:1337/api/open-calls
http://localhost:1337/api/members
http://localhost:1337/api/activities
```

**You should see JSON data!** ✅

---

## 🔌 Part 6: Connect to Next.js Website

I'll provide the code to connect your Next.js site to Strapi next.

---

## 📊 Summary

After completing these steps, you'll have:
- ✅ Strapi CMS running at `localhost:1337/admin`
- ✅ Three content types (Open Calls, Members, Activities)
- ✅ API endpoints ready at `localhost:1337/api/*`
- ✅ Easy-to-use admin interface

**Next:** Connect the Next.js website to fetch data from Strapi.

---

## 🆘 Troubleshooting

**"Port 1337 already in use":**
```bash
# Stop Strapi
# Press Ctrl+C in the terminal running Strapi
```

**"Can't access admin panel":**
```bash
# Restart Strapi
cd cms
npm run develop
```

**"Changes not showing":**
- Make sure you clicked **Publish** (not just Save)
- Check API permissions are set correctly

---

## 🎯 What Non-Technical Users Will Do Daily

After setup, content managers simply:

1. Go to `http://localhost:1337/admin` (or your cloud URL)
2. Log in
3. Click **Content Manager**
4. Click **Open Call** (or Member, Activity)
5. Click **Create new entry**
6. Fill in the form (like filling out a Google Form)
7. Click **Save** → **Publish**
8. Changes appear on the website in seconds! ✅

**No coding needed!**
