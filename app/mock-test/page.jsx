import { redirect } from 'next/navigation';

export default function MockTestIndexPage() {
  redirect('/previous-year-questions?tab=papers');
}
