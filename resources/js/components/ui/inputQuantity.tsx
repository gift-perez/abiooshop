import { useForm } from '@inertiajs/react';
import { ChevronDown, MoveDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './button';


interface InputQuantityProps {
    stock: number; // or string, depending on your data
}

export function InputQuantity({ stock }: InputQuantityProps) {

    const {data, setData, post, processing, progress, errors} = useForm({
        quantity: 1,
    })
    return(
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline">{data.quantity} <ChevronDown /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mx-4" side="bottom">
            <DropdownMenuLabel>Quantity</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={data.quantity.toString()} onValueChange={value => setData('quantity', Number(value))}>
            {Array.from({ length: stock }, (_, i) =>
                i !== 0
                    ? <DropdownMenuRadioItem key={i} value={i.toString()}>{i}</DropdownMenuRadioItem>
                    : null
            )}
            <DropdownMenuRadioItem key={stock} value={stock.toString()}>{stock}</DropdownMenuRadioItem>

            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
        </DropdownMenu>

    )
}




