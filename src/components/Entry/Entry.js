export const Entry = ({ entry }) => {
    const removeMacros = (t) => (
        t.replaceAll(/{@dice (.*?)}/g, "$1")
        .replaceAll(/{@damage (.*?)}/g, "$1")
        .replaceAll(/{@scaledamage (.*)\|(.*?)}/g, "$2")
        .replaceAll(/{@scaledice (.*?)(\|.*?)?}/g, "$1")
        .replaceAll(/{@i (.*?)}/g, "\"$1\"")
        .replaceAll(/{@skill (.*?)}/g, "$1")
        .replaceAll(/{@creature (.*?)(\|.*?)?}/g, "$1")
        .replaceAll(/{@item (.*?)\|.*?}/g, "$1")
        .replaceAll(/{@filter (.*?)\|.*?}/g, "$1")
        .replaceAll(/{@book (.*?)\|.*?}/g, "$1")
        .replaceAll(/{@chance (.*?)\|.*?}/g, "$1")
        .replaceAll(/{@note (.*)}/g, "$1")
        .replaceAll(/{@condition (.*?)(\|.*?)?}/g, "$1")
        .replaceAll(/{@action (.*?)}/g, "$1")
        .replaceAll(/{@spell (.*?)}/g, "$1")
        .replaceAll(/{@sense (.*?)}/g, "$1")
        .replaceAll(/{@d20 (.*?)}/g, "+$1")
        .replaceAll(/{@chance (.*?)}/g, "$1%")
    );

    if (typeof entry === 'string') {
        return <p>{removeMacros(entry)}</p>;
    } else {
        const { type, items = [], name, entries = [] } = entry;
        
        switch (type) {
            case 'list':
                const allStrings = !(items.some(i => typeof i !== 'string'));
                return ( allStrings ? <ul>
                    {items.map((item, i) => (
                        typeof item === 'string' ? 
                            (allStrings ? 
                                <li  key={i} className='listItem'>{removeMacros(item)}</li> 
                            : 
                                <p  key={i} className='listItem'>{removeMacros(item)}</p>
                            )
                        : 
                            <Entry key={i} entry={item} />
                        )
                    )}
                </ul> : <>
                    {items.map((item, i) => (
                        typeof item === 'string' ? 
                            <p  key={i} className='listItem'>{removeMacros(item)}</p> 
                        : 
                            <Entry key={i} entry={item} />
                        )
                    )}
                </>);
            case 'item':
            case 'entries':
                return (<>
                    <h4>{name}</h4>
                    {entries.map((e, i) => <Entry key={i} entry={e} />)}
                </>);
            case 'table':
                return <h6>See source for table</h6>
            default:
                console.log(entry);
                return <div />;
        }
    }
}