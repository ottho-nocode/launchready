import { Container } from '@/components/layout';
import { DescriptionForm } from '@/components/generate/description-form';

export default function GeneratePage() {
  return (
    <div className="py-8">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Generate App Store Texts</h1>
            <p className="mt-2 text-muted-foreground">
              Describe your app and we&apos;ll generate all the texts you need for App Store
              Connect.
            </p>
          </div>

          <DescriptionForm />
        </div>
      </Container>
    </div>
  );
}
